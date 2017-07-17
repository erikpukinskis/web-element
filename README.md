**web-element** generates HTML. That's it.

You can pass in a selector, attributes, and contents and it gives you back some HTML.

```javascript
var element = require("web-element")

element(
  "button.small", 
  {onclick: "doSomething()"},
  "DO IT"
).html()
```

Should generate:

```html
<button class="small" onclick="doSomething()">DO IT</button>
```

You can also pass arrays and it will try to turn the elements into HTML.

```javascript
element([
  "some text",
  ".some.classes",
  "<some>HTML</some>",
  element("a", {href: "/"}, "ok")
]).html()
```

Should generate:

```html
<div>
  <div>some text</div>
  <div class="some classes"></div>
  <some>HTML</some>
  <a href="/">ok</a>
</div>
```

## Inline styles

```javascript
element("h1", "Big Big News",
  element.style({
    display: "inline"
  })
)
```

generates:

```html
<h1 style="display: inline">Big Big News</h1>
```

## Templates

If you want to build an element over and over, element.template will return a function that can be used to generate elements:

```javascript
var mealTemplate = element.template(
  ".meal",
  element.style({
    "box-shadow": "1px 1px 10px #eee",
    "padding": "10px",
  }),
  function(id, title) {
    var photo = element("img", {src: "/images/"+id+".jpg"})
    var button = element("a.button", {href: "/buy/"+id}, "Deliver")
    this.addChild(photo)
    this.addChild(title)
    this.addChild(button)
  }
)

var page = element("body")

db.query("SELECT id, title FROM meals", function(id, title) {
  var meal = mealTemplate(id, title)
  page.addChild(meal)
})

page.addToHead(element.stylesheet(mealTemplate))

response.send(page.html())
```

## Media queries

```javascript
var responsive = element.style(
  ".responsive",
  {
    "@media (max-width: 600px)": {
      "font-size": "0.8em"
    }
  }
)
```

## Descendant styles

You can also include second level styles and pseduoelements. Don't forget to escape your content strings!

```javascript
var callout = element.style(
  ".callout",
  {
    "border-bottom": "2pt solid cyan",

    ".error": {
      "border-color": "red",
    },

    "::after": {
      "content": "\"\"",
      "width": "6pt",
      "height": "6pt",
      "background": "cyan",
      "vertical-align": "-2pt",
    }
  }
)
```

generates:

```css
.callout {
  border-bottom: 2pt solid cyan;
}

.callout.error {
  border-color: red;
}

.callout::after {
  content: ".";
  width: 6pt;
  height: 6pt;
  background: cyan;
  vertical-align: -2pt;
}
```

## Methods

```javascript
var el = element()

el.addSelector(".foo")

el.appendStyles({
  "display": "none"
})

el.onclick("alert(\"hi\")")

el.addChild(element("baby element"))

el.assignId() // el.id == "fj29"

el.addAttribute("src", "foo.png")

el.addAttributes({
  width: 320,
  height: 240,
})
```

Generates

```html
<div class="foo" style="display: none" onclick="alert(\"hi\")" id="fj29">
  <div>baby element</div>
</div>
```

## Why?

When someone tries to learn how to build web apps, they have to learn Javascript, HTML, and CSS all at once. Web-element lets them build web pages using only JavaScript.
