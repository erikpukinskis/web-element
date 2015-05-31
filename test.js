requirejs = require("requirejs")

requirejs(
  ["element", "chai"],
  function(element, chai) {
    var expect = chai.expect




    // Generators

    var generator = element.generator(["a"])
    var el = element()
    generator.apply(el)
    expect(el.html()).to.equal("<a></a>")

    console.log("generated!")

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

    console.log("ding ding ding!!")




    // Template Composition

    var Image = element.template("img")
    var Polaroid = element.template(Image, ".polaroid")
    var el = Polaroid()

    expect(el.html()).to.equal("<img class=\"polaroid\"></img>")

    console.log("eeeekComposition!!!")


    // Container Generator

    // It's pretty common for templates to just take some children, so we provide a handy dandy containerGenerator.

    var Body = element.template("body", element.containerGenerator)

    var el = Body(
      element("img"),
      element("a")
    )

    expect(el.html()).to.equal("<body><img></img><a></a></body>")

    console.log("contayneez!")




    // Template Styles

    var Foo = element.template(".foo", element.style({"color": "red"}))
    var el = Foo()
    expect(el.html()).to.equal("<div class=\"foo\"></div>")
    expect(Foo.styleSource()).to.contain(".foo {\n  color: red;\n}")
    console.log("*** so wow!")

    expect(element.stylesheet(Foo).html()).to.equal("<style>\n.foo {\n  color: red;\n\}\n</style>")
    console.log("stylie bus")

    var Tag = element.template(
      "span.tag",
      element.style({
        "background": "springgreen"
      })
    )
    expect(Tag.styleSource()).to.contain(".tag {\n  background: springgreen;\n}")
    console.log("ding")

    var responsive = element.template(
      ".responsive",
      element.style({
        "@media (max-width: 600px)": {
          "font-size": "0.8em"
        }
      })
    )

    expect(responsive.styleSource()).to.contain("@media (max-width: 600px) {\n.responsive {\n  font-size: 0.8em;\n}\n}")

    console.log("queeeeries")



    // Contents

    expect(element(element()).html()).to.equal("<div><div></div></div>")
    console.log("*** suuuoooopa")

    var bar = element.template(".bar")
    var foo = element.template(".foo", bar())
    var el = foo([bar()])
    expect(el.html()).to.equal("<div class=\"foo\"><div class=\"bar\"></div></div>")
    console.log("*** dit didit doot!")

    expect(element("hi").html()).to.equal("<div>hi</div>")
    console.log("DING!")

    expect(element([".foo", element("hi")]).html()).to.equal("<div><div class=\"foo\"></div><div>hi</div></div>")
    console.log("DING!")

    expect(element("<br>").html()).to.equal("<div><br></div>")
    console.log("DING!")

    expect(element(element.raw(".foo")).html()).to.equal("<div>.foo</div>")
    console.log("DING!")



    // Selectors

    expect(element(".fancy").html()).to.equal("<div class=\"fancy\"></div>")
    console.log("DING!")

    expect(element(".fancy.feast").html()).to.equal("<div class=\"fancy feast\"></div>")
    console.log("DING!")

    expect(element("img").html()).to.equal("<img></img>")
    console.log("DING!")

    expect(element(".fancy", "party").html()).to.equal("<div class=\"fancy\">party</div>")
    console.log("DING!")




    // Attributes

    expect(element({onclick: "doSomething()"}).html()).to.equal("<div onclick=\"doSomething()\"></div>")
    console.log("DING!")

    var el = element({
      onclick: "alert(\"foo\")"
    })

    expect(el.html()).to.equal('<div onclick="alert(&#x22;foo&#x22;)"></div>')




    // Binding

    var el = element()
    var id = el.assignId()
    expect(el.id).to.match(/el-[a-z0-9]{3}/)
    expect(id).to.equal(el.id)
    expect(el.html()).to.equal("<div id=\""+id+"\"></div>")


    console.log("DING DING DING DING!")
  }
)