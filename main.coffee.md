We need to bootstrap our whole system.

Commands for testing

    commands = {}

    ["echo", "cat"].forEach (name) ->
      commands[name] = PACKAGE.distribution[name].content

    Shell = require "./shell"

Pipe input to output among running apps.

List running processes.

Kill processes.

Explore a filesystem.

    require("./terminal")(Shell())
