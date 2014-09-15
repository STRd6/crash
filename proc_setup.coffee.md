Proc Setup
==========

This setup is to bootstrap the system to execute processes in the context of
web workers.

TODO: How to get PACKAGE/require working within processes

    # Function(PACKAGE.dependencies.require.distribution.main.content)()
    # Require.generateFor(PACKAGE)('./' + PACKAGE.entryPoint)

`self` in this context is the global

    self.STDOUT = (data) ->
      postMessage
        type: "STDOUT"
        message: data
