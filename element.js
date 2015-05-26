if (typeof define !== 'function') {
  var define = require('amdefine')(
    module)}

define(
  ["extend", "he"],
  function(extend, he) {
    function Element() {
      this.styles = []
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
        var isStyle = arg.constructor.name == "ElementStyle"

        console.log("arg is", arg, "of", isStyle)
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
        } else if (isStyle) {
          el.styles.push(arg)
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

    Element.prototype.render =
      function() {

        var html = ""

        html = "<" + this.tagName

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
        html = html + "</" + this.tagName + ">"

        return {html: html, stylesheet: stylesheet}
      }

    Element.prototype.html =
      function() {
        return this.render().html
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
      var elementArgs = Array.prototype.slice.call(arguments)

      return function() {
        var templateArgs = Array.prototype.slice.call(arguments)

        var args = elementArgs.concat(templateArgs)

        console.log("Calling element with", JSON.stringify(args))
        var el = element.apply(null,args)
        console.log("el is ", el)
        return el
      }
    }

    return element
  }
)