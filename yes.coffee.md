yes
===

Print y or the args out repeatedly.

    token = ARGS[0] or "y"

    setInterval ->
      STDOUT(token)
    , 0
