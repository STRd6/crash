Proc Setup
==========

This setup is to bootstrap the system to execute processes in the context of
web workers.

`self` in this context is the global

    self.STDOUT = (data) ->
      postMessage
        type: "STDOUT"
        message: data

Set up require and boot from the entry point

TODO: Fix getting require working!!!!!!!!1

    # Function(PACKAGE.dependencies.require.distribution.main.content)()
    # require = Require.generateFor(PACKAGE)
    # require("./#{PACKAGE.entryPoint}")

    Function(PACKAGE.distribution.main)()
