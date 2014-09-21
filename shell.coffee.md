Shell
=====

Execute commands, parse with a bash like syntax.

TODO: This should be a 'workerspace' program. Ideally we'll be able to require
the system library instead of os which will wrap the os functions with system 
calls.

    OS = require "./os"

Need to set up `ENV`, `PATH`, etc...

    module.exports = ->
      exec = (command) ->
        [command, args...] = command.split /\s/

        exe = commands[command]
        Function("$PROGRAM_NAME", "ARGV", "STDOUT", "STDIN", exe)(command, args, STDOUT, STDIN)
