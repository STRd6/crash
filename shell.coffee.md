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
        [command, args...] = command.trim().split(/\s+/)

        unless executable = executables[command]
          err.IN "No command '#{command}' found"

        proc = Process.exec(executable, args)

      run = (line) ->
        proc = Pipe.connect(line.split(/\|/).map(exec)...)

        proc.STDOUT std.IN
        proc.STDERR err.IN

      STDIN: run
      STDOUT: std.OUT
      STDERR: err.OUT
