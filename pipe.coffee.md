Pipe
====

Connect processes!

    module.exports = 
      connect: (procs...) ->
        procs.forEach (left, index) ->
          right = procs[index + 1]

          if right
            left.STDOUT right.STDIN

        STDOUT: procs[procs.length-1].STDOUT
        STDIN: procs[0].STDIN
