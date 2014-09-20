Proc Setup
==========

This setup is to bootstrap the system to execute processes in the context of
web workers.

`self` in this context is the global

    self.STDOUT = (data) ->
      postMessage
        type: "STDOUT"
        message: data

    inputHandler = null
    self.STDIN = (handler) ->
      inputHandler = handler

    self.onmessage = ({data}) ->
      {type, message} = data

      switch type
        when "STDIN"
          inputHandler?(message)
        when "SIGTERM"
          self.close()

Set up require and boot from the entry point

    Function(PACKAGE.dependencies.require.distribution.main.content)()

    Require.generateFor(PACKAGE)("./#{PACKAGE.entryPoint}")
