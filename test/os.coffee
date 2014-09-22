{Process, Pipe} = OS = require "../os"

echo = PACKAGE.distribution.echo.content
cat = PACKAGE.distribution.cat.content

describe "OS", ->
  describe "pipes", ->
    it "should pass data from one process to another", (done) ->
      p1 = Process.exec(echo, ["hello", "duderman"])

      p2 = Process.exec(cat)

      pipeline = Pipe.connect(p1, p2)

      pipeline.STDOUT (data) ->
        assert.equal data, "hello duderman"
        done()

    it "should work with one proc", (done) ->
      p1 = Process.exec(echo, ["hello", "duderman"])

      pipeline = Pipe.connect(p1)

      pipeline.STDOUT (data) ->
        assert.equal data, "hello duderman"
        done()
