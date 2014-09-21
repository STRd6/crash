Shell
=====

Execute commands, parse with a bash like syntax.

TODO: This should be a 'workerspace' program. Ideally we'll be able to require
the system library instead of os which will wrap the os functions with system 
calls.

    {Pipe, Process} = OS = require "./os"

Need to set up `ENV`, `PATH`, etc...

Look up executable.

    executables = {}

    ["cat", "echo"].forEach (name) ->
      executables[name] = PACKAGE.distribution[name].content

    module.exports = ->
      std = Pipe.Buffer()
      err = Pipe.Buffer()

      exec = (command) ->
        [command, args...] = command.split /\s/

        executable = executables[command]

        try
          proc = Process.exec(executable, args)

          proc.STDOUT std.IN
          proc.STDERR err.IN
        catch e
          err.IN e.message

      STDIN: exec
      STDOUT: std.OUT
      STDERR: err.OUT
