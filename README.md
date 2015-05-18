# Element

Generates HTML with a pretty flexible syntax.

You can pass in a selector, attributes, and contents and it gives you back some HTML.

    element(
      "button.small", 
      {onclick: "doSomething()"},
      "DO IT"
    )

Should generate:

    <button class="small" onclick="doSomething()">DO IT</button>

You can also pass arrays and it will try to turn the elements into HTML.

    element([
      "some text",
      ".some.classes",
      "<some>HTML</some>",
      element("a", {href: "/"}, "ok")
    ])

Should generate:

    <div>
      <div>some text</div>
      <div class="some classes"></div>
      <some>HTML</some>
      <a href="/">ok</a>
    </div>

# Testing

    npm test
