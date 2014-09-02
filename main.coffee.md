We need to bootstrap our whole system.

Commands for testing

    commands = {}

    ["echo", "cat"].forEach (name) ->
      commands[name] = PACKAGE.distribution[name].content

Run a command from the cli

    STDOUT = (value) ->
      # TODO: Do something for real
      console.log value

    # TODO: Implement for real
    STDIN = (handler) ->

    exec = (command) ->
      [command, args...] = command.split /\s/

      exe = commands[command]
      Function("$PROGRAM_NAME", "ARGV", "STDOUT", "STDIN", exe)(command, args, STDOUT, STDIN)

Run a subshell.

Run a 'GUI' app.

Run a 'Terminal' app.

    # TODO: Handle pipe
    exec 'echo hello | cat'

Pipe input to output among running apps.

List running processes.

Kill processes.

Explore a filesystem.

STDIO
