var library = require("nrtv-library")(require)

library.test(
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


library.test(
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




library.test(
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



library.test(
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



library.test(
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



library.test(
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



library.test(
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



library.test(
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
