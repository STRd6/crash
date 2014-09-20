Crash OS
========

Launch processes.

System calls.

Userspace lives in WebWorkers, they'll use `proc_setup` to provide the library
to make system calls.

File systems.

Messages
--------

Process out:

`STDOUT`
`STDERR`

Process in:

`STDIN`
`SIG*`

System
------

This file is the host OS.

    module.exports =
      Pipe: require "./pipe"
      Process: require "./process"
