if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["extend", "he"],
  function(extend, he) {
    function Element() {
      this.stylesheet = {}
    }

    // We want to be able to curry an element with a function that can act as a second constructor! I.e.:

    //   input = element("input")
    //   input({placeholder: "emptiness"})

    function element() {

      var el = new Element()
      var selectors = []

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isArray = Array.isArray(arg)
        var isString = typeof arg == "string"

        if (isArray) {
          el.children = argsToElements(arg)
        } else if (isString) {
          console.log("strrrrr")
          if (isASelector(arg)) {
            console.log("sel!")
            selectors.push(arg)
          } else {
            console.log("conto!")
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

      console.log("Args are", Array.prototype.slice.call(arguments))

      console.log("el has", JSON.stringify(el), "AND PARSE", selectors)


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
      console.log("Looking at sel", selector)
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

        if (this.classes) {
          html = html + " class=\"" + this.classes.join("") + "\""
        }

        for (key in this.attributes || {}) {
          html = html + " " + key + "=\"" + he.encode(this.attributes[key]) + "\""
        }

        html = html + ">"

        if (this.children) {
          html = html + this.children.map(
              function(el) {
                return el.html()
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
        console.log("props", properties)
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

      console.log("elementArgs:", elementArgs)
      console.log("props:", cssProperties)
      console.log("generators:", generators)

      var template = function() {
        var templateArgs = Array.prototype.slice.call(arguments)

        var el = element.apply(null,elementArgs)

        for (var i; i<generators.length; i++) {
          generators[i](el)
        }

        el.stylesheet["."+el.classes[0]] = cssProperties

        return el
      }

      return template
    }
    return element
  }
)