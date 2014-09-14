Process = require "../process"

describe "process", ->
  it "should spawn a web worker and do stuff", ->
    p = Process("STDOUT('hello world')")

    p.STDOUT (data) ->
      console.log data

    assert p
