yes
===

Print y or the args out repeatedly.

    token = ARGV[0] or "y"

    setInterval ->
      STDOUT(token)
    , 0
