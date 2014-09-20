We need to bootstrap our whole system.

Commands for testing

    commands = {}

    ["echo", "cat"].forEach (name) ->
      commands[name] = PACKAGE.distribution[name].content

    OS = require "./os"

    # TODO: Hook up a real shell
    exec = (command) ->
      [command, args...] = command.split /\s/

      exe = commands[command]
      Function("$PROGRAM_NAME", "ARGV", "STDOUT", "STDIN", exe)(command, args, STDOUT, STDIN)

Pipe input to output among running apps.

List running processes.

Kill processes.

Explore a filesystem.

    require("./terminal")(OS.Process.exec(commands.cat))
