# Element

Generates HTML with a pretty flexible syntax.

You can pass in a selector, attributes, and contents and it gives you back some HTML.

```javascript
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

var page = "<body>"

db.query("SELECT id, title FROM meals", function(id, title) {
  page += mealTemplate(id, title).html()
})

page += element.stylesheet(mealTemplate)
page += "</body>"

response.send(page)
```

## Why?

When someone tries to learn how to build web apps, they have to learn Javascript, HTML, and CSS all at once. Web-element lets them build web pages using only JavaScript.
