Process
=======

Create an run a process. (A fancily wrapped web worker).

    # TODO: Is there a better way to handle system bootstrap/requires
    setupCode = PACKAGE.distribution.proc_setup.content

    module.exports = (programCode, args=[]) ->

      # Set up program environment with a wrapper
      # that provides STDOUT, ARGV, and anything else this "OS" provides

      resourceUrl = URL.createObjectURL(new Blob([
        "ARGV=#{JSON.stringify(args)};\n", # Set up ARGV
        setupCode,
        programCode
      ]))

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
