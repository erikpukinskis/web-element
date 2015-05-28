requirejs = require("requirejs")

requirejs(
  ["element", "chai"],
  function(element, chai) {
    var expect = chai.expect

    // The template function also makes it easy to pass along element args, by proxying whatever else you pass to it to the element:

    var houseBurger = template(function(el, burger, house) {
        var burger = element(
          ".burger",
          house.parts.join()
        )

        el.children.push(burger)
      },
      ".house-burger"
    )

    var house = {
      parts: ["door", "window"]
    }

    var el = houseBurger(house)

    expect(el.html()).to.equal("<div class=\"house-burger\">door,window</div>")

    console.log("rabbit whiskers!")

    var foo = element.template(".foo", element.style({"color": "red"}))
    var el = foo()
    expect(el.html()).to.equal("<div class=\"foo\"></div>")
    expect(foo.style()).to.equal(".foo {color: red;}")
    console.log("*** so wow!")

    expect(element.stylesheet(foo).html()).to.equal("<style>.foo {color: red;}</style>")
    console.log("stylie bus")

    expect(element(element()).html()).to.equal("<div><div></div></div>")
    console.log("*** suuuoooopa")

    var bar = element.template(".bar")
    var foo = element.template(".foo", bar())
    var el = foo([bar()])
    expect(el.html()).to.equal("<div class=\"foo\"><div class=\"bar\"></div></div>")
    console.log("*** dit didit doot!")

    expect(element(".fancy").html()).to.equal("<div class=\"fancy\"></div>")
    console.log("DING!")

    expect(element(".fancy.feast").html()).to.equal("<div class=\"fancy feast\"></div>")
    console.log("DING!")

    expect(element("img").html()).to.equal("<img></img>")
    console.log("DING!")

    expect(element(".fancy", "party").html()).to.equal("<div class=\"fancy\">party</div>")
    console.log("DING!")

    expect(element({onclick: "doSomething()"}).html()).to.equal("<div onclick=\"doSomething()\"></div>")
    console.log("DING!")

    expect(element("hi").html()).to.equal("<div>hi</div>")
    console.log("DING!")

    expect(element("<br>").html()).to.equal("<div><br></div>")
    console.log("DING!")

    expect(element([".foo", element("hi")]).html()).to.equal("<div><div class=\"foo\"></div><div>hi</div></div>")
    console.log("DING!")

    var el = element()
    var id = el.assignId()
    expect(el.id).to.match(/el-[a-z0-9]{3}/)
    expect(id).to.equal(el.id)
    expect(el.html()).to.equal("<div id=\""+id+"\"></div>")

    expect(element({onclick: "alert(\"foo\")"}).html()).to.equal('<div onclick="alert(&#x22;foo&#x22;)"></div>')

    console.log("DING DING DING DING!")
  }
)