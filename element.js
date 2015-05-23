if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(
  ["extend", "he"],
  function(extend, he) {
    function Element() {}

    function element() {

      var el = new Element()

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isArray = Array.isArray(arg)
        var isString = typeof arg == "string"

        if (isArray) {
          el.children = argsToElements(arg)
        } else if (isString) {
          if (isASelector(arg)) {
            var selector = arg
          } else {
            el.contents = arg
          }
        } else {
          el.attributes = arg
        }
      }

      extend(
        el, 
        parseSelector(selector)
      )

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

      var hasTagName = 
        !!selector.match(/^[a-z]/)

      if (!hasTagName) {
        selector = "div" + selector
      }

      var parts = selector.split(".")
      var classNames = parts.slice(1)

      return {
        tagName: parts[0],
        classString: classNames.join(" ")
      }
    }

    Element.prototype.html = 
      function(el) {
        html = "<" + this.tagName

        if (this.id) {
          html = html + " id=\"" + this.id + "\""
        }

        if (this.classString) {
          html = html + " class=\"" + this.classString + "\""
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

    return element
  }
)