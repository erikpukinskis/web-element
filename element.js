if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["extend", "he"],
  function(extend, he) {
    function Element() {
      this.stylesheet = {}
      this.children = []
    }

    function element() {

      var el = new Element()
      var selectors = []

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isArray = Array.isArray(arg)
        var isString = typeof arg == "string"
        var isElement = arg.constructor.name == "Element"

        if (isArray) {
          el.children = argsToElements(arg)
        } else if (isElement) {
          el.children.push(arg)
        } else if (isString) {
          if (isASelector(arg)) {
            selectors.push(arg)
          } else {
            el.contents = arg
          }
        } else {
          el.attributes = arg
        }
      }

      for (var i=0; i<selectors.length; i++) {
        extend(
          el,
          parseSelector(selectors[i])
        )
      }

      return el
    }

    function argsToElements(array) {
      return array.map(function(arg) {
        if (arg.html) {
          return arg
        } else {
          return element(arg)
        }
      })
    }

    function isASelector(string) {
      return !!string.match(/^(img|a|div|input|button|p|h1|script|head|html|body|style)?(\.[^.]+)*$/)
    }

    function parseSelector(selector) {
      if (!selector) { selector = "" }

      var parts = selector.split(".")
      var foundTagName = (parts[0].length > 0)

      if (foundTagName) {
        return {
          tagName: parts[0],
          classes: parts.slice(1)
        }
      } else {
        return {
          classes: parts.slice(1)
        }
      }
    }

    function styleToString(style) {
      var string = ""
      for (key in style.properties) {
        var value = style.properties[key]
        if (string.length) {
          string = string + ";"
        }
        string = string + key + ": " + value
      }
      return string
    }

    Element.prototype.html =
      function() {

        var tag = this.tagName || "div"

        var html = ""

        html = "<" + tag

        if (this.id) {
          html = html + " id=\"" + this.id + "\""
        }

        if (this.classes && this.classes.length) {
          html = html + " class=\"" + this.classes.join(" ") + "\""
        }

        for (key in this.attributes || {}) {
          html = html + " " + key + "=\"" + he.encode(this.attributes[key]) + "\""
        }

        html = html + ">"

        if (this.children) {
          html = html + this.children.map(
              function(el) {
                if (el.html) {
                  return el.html()
                } else {
                  return el
                }a
              }
            ).join("")
        }
        html = html + (this.contents || "")
        html = html + "</" + tag + ">"

        return html
      }

    Element.next = 10000
    Element.prototype.assignId =
      function() {
        this.id = "el-"+(
          Element.next++
        ).toString(36)
        return this.id
      }

    function ElementStyle(properties) {
      this.properties = properties
    }

    element.style =
      function(properties) {
        return new ElementStyle(properties)
      }

    element.template = function() {
      var elementArgs = []
      var cssProperties
      var generators = []

      for (var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isStyle = arg.constructor.name == "ElementStyle"
        var isFunction = typeof arg == "function"

        if (isStyle) {
          cssProperties = arg.properties
        } else if (isFunction) {
          generators.push(arg)
        } else {
          elementArgs.push(arg)
        }
      }

      // A template is different than an element. They have different interfaces. A template takes non-htmly stuff like a burger, or a house. Element takes tag names, classes, children, DOM attributes, etc.

      // Although for convenience, since the template always has a toplevel element associated with it and you generally want to style that and add events and such to the template, template takes all of the elements arguments PLUS all the template args in one call.

      // A template also lets you associate a style with an element. There's a 1:N relationship between styles and elements, but there's a 1:1 relationship between styles and templates, so it makes sense they go here.

      function template() {
        var templateArgs = Array.prototype.slice.call(arguments)

        var el = element.apply(null,elementArgs)

        for (var i; i<generators.length; i++) {
          generators[i](el)
        }

        return el
      }

      template.style =
        function() {
          var css = this.styleSelector + " {"
          for (name in this.cssProperties) {
            css = css + name + ": " + this.cssProperties[name] + ";"
          }
          css = css + "}"
          return css
        }

      var el = element.apply(null,elementArgs)
      template.styleSelector = "."+el.classes[0]
      template.cssProperties = cssProperties

      return template
    }

    element.stylesheet = function() {
      var el = element("style")
      for(var i=0; i<arguments.length; i++) {
        el.children.push(arguments[i].style())
      }
      return el
    }

    return element
  }
)