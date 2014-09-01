We need to bootstrap our whole system.

    echo = PACKAGE.distribution.echo.content

Run a command from the cli

    STDOUT = (value) ->
      # TODO: Do something for real
      console.log value

    exec = (command) ->
      [command, args...] = command.split /\s/

      exe = echo # TODO look up command 
      Function("$PROGRAM_NAME", "ARGV", "STDOUT", exe)(command, args, STDOUT)

Run a subshell.

Run a 'GUI' app.

Run a 'Terminal' app.


    exec 'echo a b'

Pipe input to output among running apps.

List running processes.

Kill processes.

STDIO
