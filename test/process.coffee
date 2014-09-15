Process = require "../process"

describe "process", ->
  it "should spawn a web worker and do stuff", (done) ->
    p = Process("STDOUT('hello world')")

    p.STDOUT (data) ->
      assert.equal data, "hello world"
      done()

  describe "echo", ->
    echo = PACKAGE.distribution.echo.content
    it "should echo command line args", (done) ->
      p = Process(echo, ["hello", "duderman"])

      p.STDOUT (data) ->
        assert.equal data, "hello duderman"
        done()
