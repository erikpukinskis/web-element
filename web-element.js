var library = require("module-library")(require)

module.exports = library.export(
  "web-element",
  function() {
    function Element() {
      this.children = []
      this.classes = []
      this.attributes = {}
      this.__isNrtvElement = true
    }

    Element.prototype.onclick = 
      function(call) {
        if (call.evalable) {
          call = call.evalable()
        }
        this.attributes.onclick = call
      }

    Element.prototype.appendStyles = 
      function(properties) {
        var style = this.attributes.style || ""

        for(var key in properties) {
          style += stylePropertySource(key, properties[key])
        }

        this.attributes.style = style
      }

    function element() {

      var el = new Element()

      element.generator(arguments).apply(el)

      return el
    }

    element.generator =
      function(args) {
        return function() {
          if (this.constructor.name != "Element") {
            throw new Error("Tried run an element generator on "+this+" but it's not an element")
          }
          var selectors = []

          for(var i=0; i<args.length; i++) {
            var arg = args[i]
  
            if (typeof arg == "undefined") {
              args = Array.prototype.slice.call(args)
              throw new Error("You're trying to make an element out of "+JSON.stringify(args)+" but the "+i+"th argument is undefined")
            }
  
            var isArray = Array.isArray(arg)
            var isString = typeof arg == "string"
            var isElement = arg && arg.__isNrtvElement == true
            var isRaw = typeof arg.__raw == "string"
            var isStyle = arg.__isNrtvElementStyle
            var isChild = isElement || isRaw
            var isObject = typeof arg == "object"
            var isAttributes = isObject && !isRaw && !isStyle

            if (isArray) {
              addChildren(this, arg)
            } else if (isChild) {
              this.addChild(arg)
            } else if (isString) {
              if (isASelector(arg)) {
                selectors.push(arg)
              } else {
                this.contents = arg
              }
            } else if (isAttributes) {
              merge(this.attributes, arg)
            } else if (isStyle) {
              this.appendStyles(arg.properties)
            } else if (arg.toString) {
              this.addChild(arg.toString())
            } else {
              throw new Error("Element doesn't know how to handle " + arg.toString())
            }
          }

          for (var i=0; i<selectors.length; i++) {

            addSelector(this, selectors[i])
          }

          return this
        }
      }

    function merge(a, b) {
      for(key in b) {
        a[key] = b[key]
      }
    }

    function addChildren(el, args) {
      args.map(function(arg) {
        if (isASelector(arg) || Array.isArray(arg)) {
          el.addChild(element(arg))
        } else {
          el.addChild(arg)
        }

      })
    }

    var whitelist = /^(\.|(a|body|button|canvas|div|form|h1|h2|h3|head|html|iframe|img|input|li|meta|p|script|span|style|textarea|ul|link)(\[|\.|$))/

    function isASelector(string) {
      if (typeof string != "string") {
        return false
      }
      var itIs = !!string.match(whitelist)
      return itIs
    }

    function addSelector(parsed, selector) {
      if (!selector) { selector = "" }

      var parts = selector.split(".")
      var tagName = parts[0]
      var classes = parts.slice(1)

      if (tagName.length > 0) {
        parsed.tagName = tagName
      }

      for(var i=0; i<classes.length; i++) {
        parsed.classes.push(classes[i])
      }
    }

    Element.prototype.addChild = function(content) {
        if (typeof content == "undefined") {
          throw new Error("tried to add an undefined child to element "+this.html())
        }
        this.children.push(content)
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

          var value = this.attributes[key]

          if (typeof value != "string") {
            if (value.evalable) {
              throw new Error("You passed a binding ("+value.evalable()+") as your onclick attribute. Did you mean to do yourFunction.evalable()?")
            } else {
              throw new Error("You said you wanted the "+key+" attribute to be "+stringify(value)+" on your element, but attribute values need to be strings.")
            }
          }

          html = html + " " + key + "='" + escape(value) + "'"
        }

        function escape(value) {
          return value.replace("'", "&#39;")
        }

        html = html + ">"

        if (this.children) {
          for(var i=0; i<this.children.length; i++) {
            var child = this.children[i]

            if (!child) {
              throw new Error("Added an undefined child to and element. HTML so far: "+html)
            }

            if (typeof child.__raw == "string") {
              html = html + child.__raw
            } else if (child.html) {
              html = html + child.html()
            } else {
              html = html + child
            }
          }
        }

        html = html + (this.contents || "")
        html = html + "</" + tag + ">"

        return html
      }

    function stringify(whatnot) {
      if (typeof whatnot == "function") {
        return whatnot.toString()
      } else {
        return JSON.stringify(whatnot)
      }
    }

    Element.next = typeof document == "undefined" ? 10000*100 : 10000

    Element.prototype.assignId =
      function() {
        return this.id || (
          this.id = "el-"+(
            Element.next++
          ).toString(36)
        )
      }

    function ElementStyle(args) {
      this.__isNrtvElementStyle = true
      for(var i=0; i<args.length; i++) {
        var arg = args[i]
        if (typeof arg == "object") {
          this.properties = arg
        } else if (typeof arg == "string") {
          this.identifier = arg
        }
      }
    }

    ElementStyle.prototype.styleSource = function() {
      return styleSource(this.identifier, this.properties)
    }

    element.style =
      function() {
        return new ElementStyle(arguments)
      }

    element.template = function() {
      var elementArgs = []
      var cssProperties
      var generators = []

      for (var i=0; i<arguments.length; i++) {
        var arg = arguments[i]
        var isStyle = arg.__isNrtvElementStyle
        var isFunction = typeof arg == "function"
        var isTemplate = isFunction && arg.name == "template"
        var isGenerator = isFunction && !isTemplate

        if (isTemplate) {
          generators.push(arg.generator)
        } else if (isStyle) {
          if (!cssProperties) {
            cssProperties = {}
          }
          merge(cssProperties, arg.properties)
        } else if (isGenerator) {
          generators.push(arg)
        } else {
          elementArgs.push(arg)
        }
      }

      generators.push(element.generator(elementArgs))

      // A template is different than an element. They have different interfaces. A template takes non-htmly stuff like a burger, or a house. Element takes tag names, classes, children, DOM attributes, etc.

      // Although for convenience, since the template always has a toplevel element associated with it and you generally want to style that and add events and such to the template, template takes all of the elements arguments PLUS all the template args in one call.

      // A template also lets you associate a style with an element. There's a 1:N relationship between styles and elements, but there's a 1:1 relationship between styles and templates, so it makes sense they go here.

      function template() {
        var templateArgs = Array.prototype.slice.call(arguments)

        var el = element()  

        for (var i=generators.length-1; i> -1; i--) {
          generators[i].apply(el, templateArgs)
        }

        return el
      }

      template.styleSource =
        function() {
          return styleSource(this.styleIdentifier, this.cssProperties
          )
        }

      template.generator = element.generator(elementArgs)

      template.styleIdentifier = 
        getStyleIdentifier(elementArgs)

      template.cssProperties = cssProperties

      return template
    }

    element.template.container =
      function() {
        var args = Array.prototype.slice.call(arguments)

        args.push(containerGenerator)

        return element.template.apply(null, args)
      }

    function containerGenerator() {
      for (var i=0; i<arguments.length; i++) {
        this.addChild(arguments[i])
      }
    }

    function styleSource(identifer, properties) {
        var mediaQueries = ""

        var css = "\n" 
          + identifer
          + " {"

        for (key in properties) {

          if (key.match(/@media/)) {

            mediaQueries += getMediaSource(
                key,
                identifer,
                properties[key]
              )

          } else {
            css += "\n  "+stylePropertySource(key, properties[key])
          }
        }

        return css + "\n}\n" +mediaQueries
    }

    function stylePropertySource(key, value) {
      if (key == "content") {
        value = '"'+value.replace('"', '\"')+'"'
      }
      return key+": "+value+";"
    }

    function getMediaSource(query, identifier, styles) {
      var css = "\n" + query + " {\n" + identifier + " {"

      for (var name in styles) {
        css += "\n  "+name+": "+styles[name]+";"
      }
      css += "\n}\n}"
      return css
    }

    function getStyleIdentifier(args) {
      for(var i=0; i<args.length; i++) {
        var arg = args[0]
        if (isASelector(arg)) {
          var parts = arg.split(".")
          if (parts[1]) {
            return "."+parts[1]
          } else {
            return  parts[0]
          }
        }
      }
    }

    element.stylesheet = function(styles) {
      var el = element("style")

      if (!Array.isArray(styles)) {
        styles = Array.prototype.slice.call(arguments)
      }

      for(var i=0; i<styles.length; i++) {
        var style = styles[i]
        if (style.styleSource) {
          style = style.styleSource()
        }
        el.children.push(style)
      }
      return el
    }

    element.raw = function(html) {
      if (typeof html != "string") {
        throw new Error("You tried to use "+JSON.stringify(html)+" as raw HTML, but it isn't a string. HTML is strings bro.")
      }
      return {__raw: html}
    }

    return element
  }
)