window["STRd6/crash:master"]({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "CRAzy SHell\n=====\n\nA web based shell of madness.\n",
      "mode": "100644",
      "type": "blob"
    },
    "cat.coffee.md": {
      "path": "cat.coffee.md",
      "content": "cat\n===\n\nPrint everythnig from STDIN to STDOUT\n\n    STDIN STDOUT\n",
      "mode": "100644",
      "type": "blob"
    },
    "echo.coffee.md": {
      "path": "echo.coffee.md",
      "content": "Echo\n====\n\nPrint arguments to STDOUT.\n\n    STDOUT ARGV.join(\" \")\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "We need to bootstrap our whole system.\n\nCommands for testing\n\n    commands = {}\n\n    [\"echo\", \"cat\"].forEach (name) ->\n      commands[name] = PACKAGE.distribution[name].content\n\nRun a command from the cli\n\n    STDOUT = (value) ->\n      # TODO: Do something for real\n      console.log value\n\n    # TODO: Implement for real\n    STDIN = (handler) ->\n\n    exec = (command) ->\n      [command, args...] = command.split /\\s/\n\n      exe = commands[command]\n      Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN)\n\nRun a subshell.\n\nRun a 'GUI' app.\n\nRun a 'Terminal' app.\n\n    # TODO: Handle pipe\n    exec 'echo hello | cat'\n\nPipe input to output among running apps.\n\nList running processes.\n\nKill processes.\n\nExplore a filesystem.\n\nSTDIO\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\n",
      "mode": "100644",
      "type": "blob"
    },
    "process.coffee.md": {
      "path": "process.coffee.md",
      "content": "Process\n=======\n\nCreate an run a process. (A fancily wrapped web worker).\n\n    # TODO: Load this from a compiled file\n    setupCode = \"\"\"\n      var STDOUT = function(data) {\n        postMessage({\n          type: \"STDOUT\",\n          message: data\n        });\n      };\n    \"\"\"\n\n    module.exports = (programCode) ->\n\n      # TODO: Need to set up program environment with a wrapper\n      # that provides STDOUT and anything else this \"OS\" provides\n      \n      resourceUrl = URL.createObjectURL(new Blob([setupCode, programCode]))\n\n      worker = new Worker(resourceUrl)\n\n      worker.onmessage = ({data}) ->        \n        {type, message} = data\n\n        switch type\n          when \"STDOUT\"\n            handlers.forEach (handler) ->\n              handler message\n          when \"STDERR\"\n            errHandlers.forEach (handler) ->\n              handler message\n          else\n            console.log \"Unknown type\"\n\n      worker.onerror = (e) ->\n        errHandlers.forEach (handler) ->\n          handler e\n\n      # TODO: should we only allow one handler per channel?\n      handlers = []\n      errHandlers = []\n\n      STDIN: (data) ->\n        # Pass data to process' STDIN\n        worker.postMessage\n          type: \"STDIN\"\n          message: data\n      STDERR: (handler) ->\n        errHandlers.push handler\n      STDOUT: (handler) ->\n        handlers.push handler\n",
      "mode": "100644"
    },
    "test/process.coffee": {
      "path": "test/process.coffee",
      "content": "Process = require \"../process\"\n\ndescribe \"process\", ->\n  it \"should spawn a web worker and do stuff\", ->\n    p = Process(\"STDOUT('hello world')\")\n\n    p.STDOUT (data) ->\n      console.log data\n\n    assert p\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "cat": {
      "path": "cat",
      "content": "(function() {\n  STDIN(STDOUT);\n\n}).call(this);\n",
      "type": "blob"
    },
    "echo": {
      "path": "echo",
      "content": "(function() {\n  STDOUT(ARGV.join(\" \"));\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var STDIN, STDOUT, commands, exec,\n    __slice = [].slice;\n\n  commands = {};\n\n  [\"echo\", \"cat\"].forEach(function(name) {\n    return commands[name] = PACKAGE.distribution[name].content;\n  });\n\n  STDOUT = function(value) {\n    return console.log(value);\n  };\n\n  STDIN = function(handler) {};\n\n  exec = function(command) {\n    var args, exe, _ref;\n    _ref = command.split(/\\s/), command = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];\n    exe = commands[command];\n    return Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN);\n  };\n\n  exec('echo hello | cat');\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"]};",
      "type": "blob"
    },
    "process": {
      "path": "process",
      "content": "(function() {\n  var setupCode;\n\n  setupCode = \"var STDOUT = function(data) {\\n  postMessage({\\n    type: \\\"STDOUT\\\",\\n    message: data\\n  });\\n};\";\n\n  module.exports = function(programCode) {\n    var errHandlers, handlers, resourceUrl, worker;\n    resourceUrl = URL.createObjectURL(new Blob([setupCode, programCode]));\n    worker = new Worker(resourceUrl);\n    worker.onmessage = function(_arg) {\n      var data, message, type;\n      data = _arg.data;\n      type = data.type, message = data.message;\n      switch (type) {\n        case \"STDOUT\":\n          return handlers.forEach(function(handler) {\n            return handler(message);\n          });\n        case \"STDERR\":\n          return errHandlers.forEach(function(handler) {\n            return handler(message);\n          });\n        default:\n          return console.log(\"Unknown type\");\n      }\n    };\n    worker.onerror = function(e) {\n      return errHandlers.forEach(function(handler) {\n        return handler(e);\n      });\n    };\n    handlers = [];\n    errHandlers = [];\n    return {\n      STDIN: function(data) {\n        return worker.postMessage({\n          type: \"STDIN\",\n          message: data\n        });\n      },\n      STDERR: function(handler) {\n        return errHandlers.push(handler);\n      },\n      STDOUT: function(handler) {\n        return handlers.push(handler);\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/process": {
      "path": "test/process",
      "content": "(function() {\n  var Process;\n\n  Process = require(\"../process\");\n\n  describe(\"process\", function() {\n    return it(\"should spawn a web worker and do stuff\", function() {\n      var p;\n      p = Process(\"STDOUT('hello world')\");\n      p.STDOUT(function(data) {\n        return console.log(data);\n      });\n      return assert(p);\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "https://code.jquery.com/jquery-1.11.0.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/crash",
    "homepage": null,
    "description": "CRAzy SHell",
    "html_url": "https://github.com/STRd6/crash",
    "url": "https://api.github.com/repos/STRd6/crash",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});