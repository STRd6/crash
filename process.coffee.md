Process
=======

Create an run a process. (A fancily wrapped web worker).

    # TODO: Is there a better way to handle system bootstrapping?
    boot = PACKAGE.distribution.proc_setup.content

    module.exports = (programCode, args=[]) ->

      # Set up program environment with a wrapper
      # that provides STDOUT, ARGV, and anything else this "OS" provides

      pkg =
        entryPoint: "main"
        distribution:
          main: 
            content: programCode
        dependencies:
          require: PACKAGE.dependencies.require

      resourceUrl = URL.createObjectURL(new Blob([
        "PACKAGE=#{JSON.stringify(pkg)}\n", # Set up PACKAGE
        "ARGV=#{JSON.stringify(args)};\n", # Set up ARGV
        boot
      ], type: "application/javascript"))

      worker = new Worker(resourceUrl)

      worker.onmessage = ({data}) ->
        {type, message} = data

        switch type
          when "STDOUT"
            handlers.forEach (handler) ->
              handler message
          when "STDERR"
            errHandlers.forEach (handler) ->
              handler message
          else
            console.log "Unknown type"

      worker.onerror = (e) ->
        console.log e
        errHandlers.forEach (handler) ->
          handler e

      # TODO: should we only allow one handler per channel?
      handlers = []
      errHandlers = []

      STDIN: (data) ->
        # Pass data to process' STDIN
        worker.postMessage
          type: "STDIN"
          message: data
      STDERR: (handler) ->
        errHandlers.push handler
      STDOUT: (handler) ->
        handlers.push handler
