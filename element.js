if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(
  ["extend"],
  function(extend) {
    function element() {
      var el = {}

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isArray = Array.isArray(arg)
        var isString = typeof arg == "string"

        if (isArray) {
          el.contents = joinArray(arg)
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

      return toHtml(el)
    }

    function joinArray(array) {
      return array.map(function(arg) {
        if (arg.match(/</)) {
          return arg
        } else {
          return element(arg)
        }
      }).join("")
    }

    function isASelector(string) {
      return !!string.match(/^(img|a|div|input|button|p|h1)?(\.[^.]+)*$/)
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

    function toHtml(el) {
      html = "<" + el.tagName

      if (el.classString) {
        html = html + " class=\"" + el.classString + "\""
      }

      for (key in el.attributes || {}) {
        html = html + " " + key + "=\"" + el.attributes[key] + "\""
      }

      html = html + ">"
      html = html + (el.contents || "")
      html = html + "</" + el.tagName + ">"   

      return html 
    }

    return element
  }
)