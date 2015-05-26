requirejs = require("requirejs")

requirejs(
  ["element", "chai"],
  function(element, chai) {
    var expect = chai.expect

    var foo = element.template(".foo", element.style({"color": "red"}))
    var el = foo()

    console.log("down here we got an el like", JSON.stringify(el, null, 2))

    expect(el.html()).to.equal("<div class=\"foo\"></div>")

    console.log("===\n"+JSON.stringify(el.stylesheet)+"\n===")
    expect(el.stylesheet).to.deep.equal({
      ".foo": {"color": "red"},
    })
    console.log("so wow!")


    var bar = element.template(foo, ".bar", element.style({"font-weight": "bold"}))
    el = bar()

    expect(el.html()).to.equal("<div class=\"foo bar\"></div>")
    console.log("SEGA")
    expect(el.stylesheet).to.deep.equal({
      ".foo": {"color": "red"},
      ".bar": {"font-weight": "bold"}
    })
    console.log("dit didit doot!")



    // If you pass a generator, you get back a function that will make an el with your other arguments and pass it to the generator before returning it to the caller.

    var hello = element.template(
      ".sup",
      function(el, person) {
        if (person == "Erik") {
          el.contents = "Hiya " + person
        } else {
          el.contents = "Yo " + person + "!"
        }
      }
    )

    expect(hello("Erik")).to.equal("<div class=\"sup\">Hiya Erik</div>")

    expect(hello("Danie")).to.equal("<div class=\"sup\">Yo Danie</div>")
    console.log("so wow!")

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