var test = require("nrtv-test")(require)


test.using(
  "generators",
  ["./element"],
  function(expect, done, element) {

    var generator = element.generator(["a"])
    var el = element()
    generator.apply(el)
    expect(el.html()).to.equal("<a></a>")

    // The template function also makes it easy to pass along element args, by proxying whatever else you pass to the element:

    var houseBurger = element.template(function(house) {
        this.children.push(house.parts.join())
      },
      ".burger"
    )

    var house = {
      parts: ["door", "window"]
    }

    var el = houseBurger(house)

    expect(el.html()).to.equal("<div class=\"burger\">door,window</div>")

    done()
  }
)


test.using(
  "template composition",
  ["./element"],
  function(expect, done, element) {

    var Image = element.template("img")
    var Polaroid = element.template(Image, ".polaroid")
    var el = Polaroid()

    expect(el.html()).to.equal("<img class=\"polaroid\"></img>")

    done()
  }
)




test.using(
  "generating container templates",
  ["./element"],
  function(expect, done, element) {

    // It's pretty common for templates to just take some children, so we provide a handy dandy containerGenerator.

    var Body = element.template.container("body")

    var el = Body(
      element("img"),
      element("a")
    )

    expect(el.html()).to.equal("<body><img></img><a></a></body>")

    // Which is equivalent to

    element.template(
      "body",
      function(a, b /*etc*/) {
        this.children.push(a)
        this.children.push(b)
        /*etc*/
      }
    )

    done()
  }
)


test.using(
  "inline styles",
  ["./element"],
  function(expect, done, element) {
    var red = element(
      element.style({color: "red"})
    )

    expect(red.html()).to.equal("<div style=\"color: red;\"></div>")

    done()
  }
)

test.using(
  "template styles",
  ["./element"],
  function(expect, done, element) {

    var Foo = element.template(".foo", element.style({"color": "red"}))
    var el = Foo()
    expect(el.html()).to.equal("<div class=\"foo\"></div>")
    expect(Foo.styleSource()).to.contain(".foo {\n  color: red;\n}")

    expect(element.stylesheet(Foo).html()).to.equal("<style>\n.foo {\n  color: red;\n\}\n</style>")

    var Tag = element.template(
      "span.tag",
      element.style({
        "background": "springgreen"
      })
    )
    expect(Tag.styleSource()).to.contain(".tag {\n  background: springgreen;\n}")

    var responsive = element.template(
      ".responsive",
      element.style({
        "@media (max-width: 600px)": {
          "font-size": "0.8em"
        }
      })
    )

    expect(responsive.styleSource()).to.contain("@media (max-width: 600px) {\n.responsive {\n  font-size: 0.8em;\n}\n}")

    done()
  }
)



test.using(
  "contents",
  ["./element"],
  function(expect, done, element) {

    expect(element(element()).html()).to.equal("<div><div></div></div>")

    var bar = element.template(".bar")
    var foo = element.template(".foo", bar())
    var el = foo([bar()])
    expect(el.html()).to.equal("<div class=\"foo\"><div class=\"bar\"></div></div>")

    expect(element("hi").html()).to.equal("<div>hi</div>")

    expect(element([".foo", element("hi")]).html()).to.equal("<div><div class=\"foo\"></div><div>hi</div></div>")

    expect(element("<br>").html()).to.equal("<div><br></div>")

    expect(element(element.raw(".foo")).html()).to.equal("<div>.foo</div>")

    expect(element(element.raw("")).html()).to.equal("<div></div>")

    done()
  }
)



test.using(
  "selectors",
  ["./element"],
  function(expect, done, element) {

    expect(element(".fancy").html()).to.equal("<div class=\"fancy\"></div>")

    expect(element(".fancy.feast").html()).to.equal("<div class=\"fancy feast\"></div>")

    expect(element("img").html()).to.equal("<img></img>")

    expect(element(".fancy", "party").html()).to.equal("<div class=\"fancy\">party</div>")

    done()
  }
)



test.using(
  "attributes",
  ["./element"],
  function(expect, done, element) {

    expect(element({onclick: "doSomething()"}).html()).to.equal("<div onclick=\"doSomething()\"></div>")

    var el = element({
      onclick: "alert(\"foo\")"
    })

    expect(el.html()).to.equal('<div onclick="alert(&quot;foo&quot;)"></div>')

    done()
  }
)



test.using(
  "binding",
  ["./element"],
  function(expect, done, element) {

    var el = element()
    var id = el.assignId()
    expect(el.id).to.match(/el-[a-z0-9]{3}/)
    expect(id).to.equal(el.id)
    expect(el.html()).to.equal("<div id=\""+id+"\"></div>")

    done()
  }
)



test.using(
  "bodies",

  ["./"],
  function(expect, done, element) {

    var body = element.template(
      "body",
      element.style({
        margin: "0"
      })
    )

    var html = element.stylesheet(body).html()

    expect(html).to.match(/body {/)
    done()
  }
)


test.using(
  "standalone styles",
  ["./"],
  function(expect, done, element) {
    var body = element.style(
      "body, input", {
        "font-family": "Helvetica",
      }
    )

    expect(body.styleSource()).to.equal(
      "\nbody, input {\n" +
      "  font-family: Helvetica;\n" +
      "}\n"
    )

    done()
  }
)


test.using(
  "onclick",
  ["./element", "nrtv-function-call"],
  function(expect, done, element, functionCall) {

    function dirt() {}

    var el = element()
    el.onclick(functionCall(dirt))

    expect(el.html()).to.equal("<div onclick=\"dirt()\"></div>")

    done()
  }
)


