We need to bootstrap our whole system.

Commands for testing

    commands = {}

    ["echo", "cat"].forEach (name) ->
      commands[name] = PACKAGE.distribution[name].content

    OS = require "./os"

Pipe input to output among running apps.

List running processes.

Kill processes.

Explore a filesystem.

    # TODO: Run the shell process rather than cat
    require("./terminal")(OS.Process.exec(commands.cat))
