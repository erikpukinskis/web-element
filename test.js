requirejs = require("requirejs")

requirejs(
  ["element", "chai"],
  function(element, chai) {
    var expect = chai.expect

    var boxTemplate = element("box")
    var turkeyEl = boxTemplate(".turkey", "lozenge")
    expect(turkeyEl.html()).to.equal("<box class=\"turkey\">lozenge</box>")
    console.log("DONG!")

    var input = element("input.foo", element.style({
      "border-bottom": "2px solid black"
    })
    var fragment = input.render()
    expect(fragment.css).to.equal(".foo {border-bottom: 2ps solid black;}")
    expect(fragment.html).to.equal("<input class=\"foo\"></input>")

    expect(element(".fancy").html()).to.equal("<div class=\"fancy\"></div>")
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