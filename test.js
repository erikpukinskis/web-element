requirejs = require("requirejs")

requirejs(["nrtv-element", "chai"],
  function(element, chai) {
    var expect = chai.expect

    expect(element(".fancy")).to.equal("<div class=\"fancy\"></div>")
    console.log("DING!")

    expect(element("img")).to.equal("<img></img>")
    console.log("DING!")

    expect(element(".fancy", "party")).to.equal("<div class=\"fancy\">party</div>")
    console.log("DING!")

    expect(element({onclick: "doSomething()"})).to.equal("<div onclick=\"doSomething()\"></div>")
    console.log("DING!")

    expect(element("hi")).to.equal("<div>hi</div>")
    console.log("DING!")

    expect(element("<br>")).to.equal("<div><br></div>")
    console.log("DING!")

    expect(element(["<a></a>", "<b></b>"])).to.equal("<div><a></a><b></b></div>")
    console.log("DING!")

    expect(element([".foo", element("hi")])).to.equal("<div><div class=\"foo\"></div><div>hi</div></div>")
    console.log("DING!")
  }
)