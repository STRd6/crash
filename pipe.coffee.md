Pipe
====

Connect processes!

    # TODO: Figure out how to get a decent buffer dealy
    # TODO: Maybe keep a little buffer to collect data before a handler is
    # attached
    Buffer = ->
      outFn = null

      IN: (data) ->
        outFn?(data)

      OUT:
        (handler) ->
          outFn = handler

    module.exports =
      Buffer: Buffer

      connect: (procs...) ->
        procs.forEach (left, index) ->
          right = procs[index + 1]

          if right
            left.STDOUT right.STDIN

        STDOUT: procs[procs.length-1].STDOUT
        STDIN: procs[0].STDIN
