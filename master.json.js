window["STRd6/crash:master"]({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "CRAzy SHell\n=====\n\nA web based shell of madness.\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "We need to bootstrap our whole system.\n\nCommands for testing\n\n    commands = {}\n\n    [\"echo\", \"cat\"].forEach (name) ->\n      commands[name] = PACKAGE.distribution[name].content\n\nRun a command from the cli\n\n    STDOUT = (value) ->\n      # TODO: Do something for real\n      console.log value\n\n    # TODO: Implement for real\n    STDIN = (handler) ->\n\n    exec = (command) ->\n      [command, args...] = command.split /\\s/\n\n      exe = commands[command]\n      Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN)\n\nRun a subshell.\n\nRun a 'GUI' app.\n\nRun a 'Terminal' app.\n\n    # TODO: Handle pipe\n    exec 'echo hello | cat'\n\nPipe input to output among running apps.\n\nList running processes.\n\nKill processes.\n\nExplore a filesystem.\n\nSTDIO\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\n",
      "mode": "100644"
    },
    "echo.coffee.md": {
      "path": "echo.coffee.md",
      "content": "Echo\n====\n\nPrint arguments to STDOUT.\n\n    STDOUT ARGV.join(\" \")\n",
      "mode": "100644"
    },
    "cat.coffee.md": {
      "path": "cat.coffee.md",
      "content": "cat\n===\n\nPrint everythnig from STDIN to STDOUT\n\n    STDIN STDOUT\n",
      "mode": "100644"
    }
  },
  "distribution": {
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
    "echo": {
      "path": "echo",
      "content": "(function() {\n  STDOUT(ARGV.join(\" \"));\n\n}).call(this);\n",
      "type": "blob"
    },
    "cat": {
      "path": "cat",
      "content": "(function() {\n  STDIN(STDOUT);\n\n}).call(this);\n",
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