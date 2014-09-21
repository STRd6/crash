(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
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
      "content": "We need to bootstrap our whole system.\n\nCommands for testing\n\n    commands = {}\n\n    [\"echo\", \"cat\"].forEach (name) ->\n      commands[name] = PACKAGE.distribution[name].content\n\n    OS = require \"./os\"\n\nPipe input to output among running apps.\n\nList running processes.\n\nKill processes.\n\nExplore a filesystem.\n\n    # TODO: Run the shell process rather than cat\n    require(\"./terminal\")(OS.Process.exec(commands.cat))\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies:\n  require: \"distri/require:v0.4.3-pre.0\"\n  util: \"distri/util:v0.1.0\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "proc_setup.coffee.md": {
      "path": "proc_setup.coffee.md",
      "content": "Proc Setup\n==========\n\nThis setup is to bootstrap the system to execute processes in the context of\nweb workers.\n\n`self` in this context is the global\n\n    self.STDOUT = (data) ->\n      postMessage\n        type: \"STDOUT\"\n        message: data\n\n    inputHandler = null\n    self.STDIN = (handler) ->\n      inputHandler = handler\n\n    self.onmessage = ({data}) ->\n      {type, message} = data\n\n      switch type\n        when \"STDIN\"\n          inputHandler?(message)\n        when \"SIGTERM\"\n          self.close()\n\nSet up require and boot from the entry point\n\n    Function(PACKAGE.dependencies.require.distribution.main.content)()\n\n    Require.generateFor(PACKAGE)(\"./#{PACKAGE.entryPoint}\")\n",
      "mode": "100644",
      "type": "blob"
    },
    "process.coffee.md": {
      "path": "process.coffee.md",
      "content": "Process\n=======\n\nCreate an run a process. (A fancily wrapped web worker).\n\n    # TODO: Is there a better way to handle system bootstrapping?\n    boot = PACKAGE.distribution.proc_setup.content\n\n    module.exports = \n      exec: (programCode, args=[]) ->\n\n        # Set up program environment with a wrapper\n        # that provides STDOUT, ARGV, and anything else this \"OS\" provides\n  \n        pkg =\n          entryPoint: \"main\"\n          distribution:\n            main:\n              content: programCode\n          dependencies:\n            require: PACKAGE.dependencies.require\n\n        resourceUrl = URL.createObjectURL(new Blob([\n          \"PACKAGE=#{JSON.stringify(pkg)}\\n\", # Set up PACKAGE\n          \"ARGV=#{JSON.stringify(args)};\\n\", # Set up ARGV\n          boot\n        ], type: \"application/javascript\"))\n  \n        worker = new Worker(resourceUrl)\n  \n        worker.onmessage = ({data}) ->\n          {type, message} = data\n  \n          switch type\n            when \"STDOUT\"\n              handlers.forEach (handler) ->\n                handler message\n            when \"STDERR\"\n              errHandlers.forEach (handler) ->\n                handler message\n            else\n              console.log \"Unknown type\"\n  \n        worker.onerror = (e) ->\n          console.log e\n          errHandlers.forEach (handler) ->\n            handler e\n  \n        # TODO: should we only allow one handler per channel?\n        handlers = []\n        errHandlers = []\n  \n        STDIN: (data) ->\n          # Pass data to process' STDIN\n          worker.postMessage\n            type: \"STDIN\"\n            message: data\n        STDERR: (handler) ->\n          errHandlers.push handler\n        STDOUT: (handler) ->\n          handlers.push handler\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/process.coffee": {
      "path": "test/process.coffee",
      "content": "Process = require \"../process\"\n\ndescribe \"process\", ->\n  it \"should spawn a web worker and do stuff\", (done) ->\n    p = Process.exec(\"STDOUT('hello world')\")\n\n    p.STDOUT (data) ->\n      assert.equal data, \"hello world\"\n      done()\n\n  describe \"echo\", ->\n    echo = PACKAGE.distribution.echo.content\n    it \"should echo command line args\", (done) ->\n      p = Process.exec(echo, [\"hello\", \"duderman\"])\n\n      p.STDOUT (data) ->\n        assert.equal data, \"hello duderman\"\n        done()\n",
      "mode": "100644",
      "type": "blob"
    },
    "os.coffee.md": {
      "path": "os.coffee.md",
      "content": "Crash OS\n========\n\nLaunch processes.\n\nSystem calls.\n\nUserspace lives in WebWorkers, they'll use `proc_setup` to provide the library\nto make system calls.\n\nFile systems.\n\nMessages\n--------\n\nProcess out:\n\n`STDOUT`\n`STDERR`\n\nProcess in:\n\n`STDIN`\n`SIG*`\n\nSystem\n------\n\nThis file is the host OS.\n\n    module.exports =\n      Pipe: require \"./pipe\"\n      Process: require \"./process\"\n",
      "mode": "100644"
    },
    "pipe.coffee.md": {
      "path": "pipe.coffee.md",
      "content": "Pipe\n====\n\nConnect processes!\n\n    module.exports = \n      connect: (procs...) ->\n        procs.forEach (left, index) ->\n          right = procs[index + 1]\n\n          if right\n            left.STDOUT right.STDIN\n\n        STDOUT: procs[procs.length-1].STDOUT\n        STDIN: procs[0].STDIN\n",
      "mode": "100644"
    },
    "test/os.coffee": {
      "path": "test/os.coffee",
      "content": "{Process, Pipe} = OS = require \"../os\"\n\necho = PACKAGE.distribution.echo.content\ncat = PACKAGE.distribution.cat.content\n\ndescribe \"OS\", ->\n  describe \"pipes\", ->\n    it \"should pass data from one process to another\", (done) ->\n      p1 = Process.exec(echo, [\"hello\", \"duderman\"])\n\n      p2 = Process.exec(cat)\n\n      pipeline = Pipe.connect(p1, p2)\n\n      pipeline.STDOUT (data) ->\n        assert.equal data, \"hello duderman\"\n        done()\n",
      "mode": "100644"
    },
    "yes.coffee.md": {
      "path": "yes.coffee.md",
      "content": "",
      "mode": "100644"
    },
    "terminal.coffee.md": {
      "path": "terminal.coffee.md",
      "content": "Terminal\n========\n\nExecute input and display output.\n\n    {applyStylesheet} = require \"util\"\n\n    template = require \"./templates/terminal\"\n\n    module.exports = ({STDIN, STDOUT}) ->\n      model =\n        submit: (event) ->\n          event.preventDefault()\n\n          command = input.value\n          input.value = \"\"\n\n          STDIN(command)\n\n          input.value = \"\"\n\n      STDOUT (data) ->\n        pre.textContent += data + \"\\n\"\n\n      applyStylesheet(require(\"./style/terminal\"), \"terminal\")\n\n      element = template(model)\n\n      document.body.appendChild element\n\n      input = element.getElementsByTagName(\"input\")[0]\n      pre = element.getElementsByTagName(\"pre\")[0]\n\n      return element",
      "mode": "100644"
    },
    "templates/terminal.haml": {
      "path": "templates/terminal.haml",
      "content": "%form.terminal(@submit)\n  %pre\n  %input\n  .prompt crash>\n",
      "mode": "100644"
    },
    "style/terminal.styl": {
      "path": "style/terminal.styl",
      "content": "html, body, .terminal, pre\n  height: 100%\n\n.terminal\n  position: relative\n\npre\n  background-color: black\n  box-sizing: border-box\n  padding-bottom: 20px\n\ninput\n  background-color: black\n  box-sizing: border-box\n  border: none\n  bottom: 0\n  padding: 0 0 0 60px\n  position: absolute\n  width: 100%\n\n.prompt\n  bottom: 0\n  left: 0\n  position: absolute\n\nbody, pre, input\n  color: #080\n  font-family: Monaco, Menlo, 'Ubuntu Mono', 'Droid Sans Mono', Consolas, monospace\n  font-size: 18px\n  margin: 0\n",
      "mode": "100644"
    },
    "shell.coffee.md": {
      "path": "shell.coffee.md",
      "content": "Shell\n=====\n\nExecute commands, parse with a bash like syntax.\n\nTODO: This should be a 'workerspace' program. Ideally we'll be able to require\nthe system library instead of os which will wrap the os functions with system \ncalls.\n\n    OS = require \"./os\"\n\nNeed to set up `ENV`, `PATH`, etc...\n\n    module.exports = ->\n      exec = (command) ->\n        [command, args...] = command.split /\\s/\n\n        exe = commands[command]\n        Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN)\n",
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
      "content": "(function() {\n  var OS, commands;\n\n  commands = {};\n\n  [\"echo\", \"cat\"].forEach(function(name) {\n    return commands[name] = PACKAGE.distribution[name].content;\n  });\n\n  OS = require(\"./os\");\n\n  require(\"./terminal\")(OS.Process.exec(commands.cat));\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"require\":\"distri/require:v0.4.3-pre.0\",\"util\":\"distri/util:v0.1.0\"}};",
      "type": "blob"
    },
    "proc_setup": {
      "path": "proc_setup",
      "content": "(function() {\n  var inputHandler;\n\n  self.STDOUT = function(data) {\n    return postMessage({\n      type: \"STDOUT\",\n      message: data\n    });\n  };\n\n  inputHandler = null;\n\n  self.STDIN = function(handler) {\n    return inputHandler = handler;\n  };\n\n  self.onmessage = function(_arg) {\n    var data, message, type;\n    data = _arg.data;\n    type = data.type, message = data.message;\n    switch (type) {\n      case \"STDIN\":\n        return typeof inputHandler === \"function\" ? inputHandler(message) : void 0;\n      case \"SIGTERM\":\n        return self.close();\n    }\n  };\n\n  Function(PACKAGE.dependencies.require.distribution.main.content)();\n\n  Require.generateFor(PACKAGE)(\"./\" + PACKAGE.entryPoint);\n\n}).call(this);\n",
      "type": "blob"
    },
    "process": {
      "path": "process",
      "content": "(function() {\n  var boot;\n\n  boot = PACKAGE.distribution.proc_setup.content;\n\n  module.exports = {\n    exec: function(programCode, args) {\n      var errHandlers, handlers, pkg, resourceUrl, worker;\n      if (args == null) {\n        args = [];\n      }\n      pkg = {\n        entryPoint: \"main\",\n        distribution: {\n          main: {\n            content: programCode\n          }\n        },\n        dependencies: {\n          require: PACKAGE.dependencies.require\n        }\n      };\n      resourceUrl = URL.createObjectURL(new Blob([\"PACKAGE=\" + (JSON.stringify(pkg)) + \"\\n\", \"ARGV=\" + (JSON.stringify(args)) + \";\\n\", boot], {\n        type: \"application/javascript\"\n      }));\n      worker = new Worker(resourceUrl);\n      worker.onmessage = function(_arg) {\n        var data, message, type;\n        data = _arg.data;\n        type = data.type, message = data.message;\n        switch (type) {\n          case \"STDOUT\":\n            return handlers.forEach(function(handler) {\n              return handler(message);\n            });\n          case \"STDERR\":\n            return errHandlers.forEach(function(handler) {\n              return handler(message);\n            });\n          default:\n            return console.log(\"Unknown type\");\n        }\n      };\n      worker.onerror = function(e) {\n        console.log(e);\n        return errHandlers.forEach(function(handler) {\n          return handler(e);\n        });\n      };\n      handlers = [];\n      errHandlers = [];\n      return {\n        STDIN: function(data) {\n          return worker.postMessage({\n            type: \"STDIN\",\n            message: data\n          });\n        },\n        STDERR: function(handler) {\n          return errHandlers.push(handler);\n        },\n        STDOUT: function(handler) {\n          return handlers.push(handler);\n        }\n      };\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/process": {
      "path": "test/process",
      "content": "(function() {\n  var Process;\n\n  Process = require(\"../process\");\n\n  describe(\"process\", function() {\n    it(\"should spawn a web worker and do stuff\", function(done) {\n      var p;\n      p = Process.exec(\"STDOUT('hello world')\");\n      return p.STDOUT(function(data) {\n        assert.equal(data, \"hello world\");\n        return done();\n      });\n    });\n    return describe(\"echo\", function() {\n      var echo;\n      echo = PACKAGE.distribution.echo.content;\n      return it(\"should echo command line args\", function(done) {\n        var p;\n        p = Process.exec(echo, [\"hello\", \"duderman\"]);\n        return p.STDOUT(function(data) {\n          assert.equal(data, \"hello duderman\");\n          return done();\n        });\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "os": {
      "path": "os",
      "content": "(function() {\n  module.exports = {\n    Pipe: require(\"./pipe\"),\n    Process: require(\"./process\")\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pipe": {
      "path": "pipe",
      "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    connect: function() {\n      var procs;\n      procs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      procs.forEach(function(left, index) {\n        var right;\n        right = procs[index + 1];\n        if (right) {\n          return left.STDOUT(right.STDIN);\n        }\n      });\n      return {\n        STDOUT: procs[procs.length - 1].STDOUT,\n        STDIN: procs[0].STDIN\n      };\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/os": {
      "path": "test/os",
      "content": "(function() {\n  var OS, Pipe, Process, cat, echo, _ref;\n\n  _ref = OS = require(\"../os\"), Process = _ref.Process, Pipe = _ref.Pipe;\n\n  echo = PACKAGE.distribution.echo.content;\n\n  cat = PACKAGE.distribution.cat.content;\n\n  describe(\"OS\", function() {\n    return describe(\"pipes\", function() {\n      return it(\"should pass data from one process to another\", function(done) {\n        var p1, p2, pipeline;\n        p1 = Process.exec(echo, [\"hello\", \"duderman\"]);\n        p2 = Process.exec(cat);\n        pipeline = Pipe.connect(p1, p2);\n        return pipeline.STDOUT(function(data) {\n          assert.equal(data, \"hello duderman\");\n          return done();\n        });\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "yes": {
      "path": "yes",
      "content": "(function() {\n\n\n}).call(this);\n",
      "type": "blob"
    },
    "terminal": {
      "path": "terminal",
      "content": "(function() {\n  var applyStylesheet, template;\n\n  applyStylesheet = require(\"util\").applyStylesheet;\n\n  template = require(\"./templates/terminal\");\n\n  module.exports = function(_arg) {\n    var STDIN, STDOUT, element, input, model, pre;\n    STDIN = _arg.STDIN, STDOUT = _arg.STDOUT;\n    model = {\n      submit: function(event) {\n        var command;\n        event.preventDefault();\n        command = input.value;\n        input.value = \"\";\n        STDIN(command);\n        return input.value = \"\";\n      }\n    };\n    STDOUT(function(data) {\n      return pre.textContent += data + \"\\n\";\n    });\n    applyStylesheet(require(\"./style/terminal\"), \"terminal\");\n    element = template(model);\n    document.body.appendChild(element);\n    input = element.getElementsByTagName(\"input\")[0];\n    pre = element.getElementsByTagName(\"pre\")[0];\n    return element;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "templates/terminal": {
      "path": "templates/terminal",
      "content": "module.exports = (function(data) {\n  return (function() {\n    var __runtime;\n    __runtime = require(\"/lib/hamlet-runtime\")(this);\n    __runtime.push(document.createDocumentFragment());\n    __runtime.push(document.createElement(\"form\"));\n    __runtime.classes(\"terminal\");\n    __runtime.attribute(\"submit\", this.submit);\n    __runtime.push(document.createElement(\"pre\"));\n    __runtime.pop();\n    __runtime.push(document.createElement(\"input\"));\n    __runtime.pop();\n    __runtime.push(document.createElement(\"div\"));\n    __runtime.classes(\"prompt\");\n    __runtime.text(\"crash>\\n\");\n    __runtime.pop();\n    __runtime.pop();\n    return __runtime.pop();\n  }).call(data);\n});\n",
      "type": "blob"
    },
    "style/terminal": {
      "path": "style/terminal",
      "content": "module.exports = \"html,\\nbody,\\n.terminal,\\npre {\\n  height: 100%;\\n}\\n\\n.terminal {\\n  position: relative;\\n}\\n\\npre {\\n  background-color: black;\\n  padding-bottom: 20px;\\n  -ms-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  -webkit-box-sizing: border-box;\\n  box-sizing: border-box;\\n}\\n\\ninput {\\n  background-color: black;\\n  border: none;\\n  bottom: 0;\\n  padding: 0 0 0 60px;\\n  position: absolute;\\n  width: 100%;\\n  -ms-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  -webkit-box-sizing: border-box;\\n  box-sizing: border-box;\\n}\\n\\n.prompt {\\n  bottom: 0;\\n  left: 0;\\n  position: absolute;\\n}\\n\\nbody,\\npre,\\ninput {\\n  color: #080;\\n  font-family: Monaco, Menlo, 'Ubuntu Mono', 'Droid Sans Mono', Consolas, monospace;\\n  font-size: 18px;\\n  margin: 0;\\n}\";",
      "type": "blob"
    },
    "shell": {
      "path": "shell",
      "content": "(function() {\n  var OS,\n    __slice = [].slice;\n\n  OS = require(\"./os\");\n\n  module.exports = function() {\n    var exec;\n    return exec = function(command) {\n      var args, exe, _ref;\n      _ref = command.split(/\\s/), command = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];\n      exe = commands[command];\n      return Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN);\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/hamlet-runtime": {
      "path": "lib/hamlet-runtime",
      "content": "!function(e){if(\"object\"==typeof exports&&\"undefined\"!=typeof module)module.exports=e();else if(\"function\"==typeof define&&define.amd)define([],e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.Hamlet=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error(\"Cannot find module '\"+o+\"'\")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){\n// Generated by CoffeeScript 1.7.1\n(function() {\n  var Observable, Runtime, bindEvent, bindObservable, cleanup, contentBind, empty, eventNames, initContent, isEvent, isFragment, remove, specialBindings, valueBind, valueIndexOf,\n    __slice = [].slice;\n\n  Observable = _dereq_(\"o_0\");\n\n  eventNames = \"abort\\nblur\\nchange\\nclick\\ndblclick\\ndrag\\ndragend\\ndragenter\\ndragleave\\ndragover\\ndragstart\\ndrop\\nerror\\nfocus\\ninput\\nkeydown\\nkeypress\\nkeyup\\nload\\nmousedown\\nmousemove\\nmouseout\\nmouseover\\nmouseup\\nreset\\nresize\\nscroll\\nselect\\nsubmit\\ntouchcancel\\ntouchend\\ntouchenter\\ntouchleave\\ntouchmove\\ntouchstart\\nunload\".split(\"\\n\");\n\n  isEvent = function(name) {\n    return eventNames.indexOf(name) !== -1;\n  };\n\n  isFragment = function(node) {\n    return (node != null ? node.nodeType : void 0) === 11;\n  };\n\n  initContent = function(element) {\n    var allContent, update;\n    if (element._hamlet_content) {\n      return element._hamlet_content;\n    }\n    allContent = (element._hamlet_content != null ? element._hamlet_content : element._hamlet_content = Observable.concat());\n    update = function() {\n      empty(element);\n      return allContent.each(function(item) {\n        return element.appendChild(item);\n      });\n    };\n    bindObservable(element, allContent, null, update);\n    return allContent;\n  };\n\n  contentBind = function(element, value) {\n    initContent(element).push(value);\n    return element;\n  };\n\n  valueBind = function(element, value, context) {\n    var update;\n    value = Observable(value, context);\n    switch (element.nodeName) {\n      case \"SELECT\":\n        element.oninput = element.onchange = function() {\n          var optionValue, _ref, _value;\n          _ref = this.children[this.selectedIndex], optionValue = _ref.value, _value = _ref._value;\n          return value(_value || optionValue);\n        };\n        update = function(newValue) {\n          var options;\n          element._value = newValue;\n          if ((options = element._options)) {\n            if (newValue.value != null) {\n              return element.value = (typeof newValue.value === \"function\" ? newValue.value() : void 0) || newValue.value;\n            } else {\n              return element.selectedIndex = valueIndexOf(options, newValue);\n            }\n          } else {\n            return element.value = newValue;\n          }\n        };\n        bindObservable(element, value, context, update);\n        break;\n      default:\n        element.oninput = element.onchange = function() {\n          return value(element.value);\n        };\n        if (typeof element.attachEvent === \"function\") {\n          element.attachEvent(\"onkeydown\", function() {\n            return setTimeout(function() {\n              return value(element.value);\n            }, 0);\n          });\n        }\n        bindObservable(element, value, context, function(newValue) {\n          if (element.value !== newValue) {\n            return element.value = newValue;\n          }\n        });\n    }\n  };\n\n  specialBindings = {\n    INPUT: {\n      checked: function(element, value, context) {\n        element.onchange = function() {\n          return typeof value === \"function\" ? value(element.checked) : void 0;\n        };\n        return bindObservable(element, value, context, function(newValue) {\n          return element.checked = newValue;\n        });\n      }\n    },\n    SELECT: {\n      options: function(element, values, context) {\n        var updateValues;\n        values = Observable(values, context);\n        updateValues = function(values) {\n          empty(element);\n          element._options = values;\n          return values.map(function(value, index) {\n            var option, optionName, optionValue;\n            option = document.createElement(\"option\");\n            option._value = value;\n            if (typeof value === \"object\") {\n              optionValue = (value != null ? value.value : void 0) || index;\n            } else {\n              optionValue = value.toString();\n            }\n            bindObservable(option, optionValue, value, function(newValue) {\n              return option.value = newValue;\n            });\n            optionName = (value != null ? value.name : void 0) || value;\n            bindObservable(option, optionName, value, function(newValue) {\n              return option.textContent = option.innerText = newValue;\n            });\n            element.appendChild(option);\n            if (value === element._value) {\n              element.selectedIndex = index;\n            }\n            return option;\n          });\n        };\n        return bindObservable(element, values, context, updateValues);\n      }\n    }\n  };\n\n  bindObservable = function(element, value, context, update) {\n    var observable, observe, unobserve;\n    observable = Observable(value, context);\n    observe = function() {\n      observable.observe(update);\n      return update(observable());\n    };\n    unobserve = function() {\n      return observable.stopObserving(update);\n    };\n    observe();\n    try {\n      (element._hamlet_cleanup || (element._hamlet_cleanup = [])).push(unobserve);\n    } catch (_error) {}\n    return element;\n  };\n\n  bindEvent = function(element, name, fn, context) {\n    return element[name] = function() {\n      return fn.apply(context, arguments);\n    };\n  };\n\n  cleanup = function(element) {\n    var _ref;\n    Array.prototype.forEach.call(element.children, cleanup);\n    if ((_ref = element._hamlet_cleanup) != null) {\n      _ref.forEach(function(method) {\n        return method();\n      });\n    }\n    delete element._hamlet_cleanup;\n  };\n\n  Runtime = function(context) {\n    var append, buffer, classes, contextTop, id, lastParent, observeAttribute, observeText, pop, push, render, self, stack, top, withContext;\n    stack = [];\n    lastParent = function() {\n      var element, i;\n      i = stack.length - 1;\n      while ((element = stack[i]) && isFragment(element)) {\n        i -= 1;\n      }\n      return element;\n    };\n    contextTop = void 0;\n    top = function() {\n      return stack[stack.length - 1] || contextTop;\n    };\n    append = function(child) {\n      var parent, _ref;\n      parent = top();\n      if (isFragment(child) && child.childNodes.length === 1) {\n        child = child.childNodes[0];\n      }\n      if ((_ref = top()) != null) {\n        _ref.appendChild(child);\n      }\n      return child;\n    };\n    push = function(child) {\n      return stack.push(child);\n    };\n    pop = function() {\n      return append(stack.pop());\n    };\n    render = function(child) {\n      push(child);\n      return pop();\n    };\n    id = function() {\n      var element, sources, update, value;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.id = newValue;\n      };\n      value = function() {\n        var possibleValues;\n        possibleValues = sources.map(function(source) {\n          if (typeof source === \"function\") {\n            return source();\n          } else {\n            return source;\n          }\n        }).filter(function(idValue) {\n          return idValue != null;\n        });\n        return possibleValues[possibleValues.length - 1];\n      };\n      return bindObservable(element, value, context, update);\n    };\n    classes = function() {\n      var element, sources, update;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.className = newValue;\n      };\n      return (function(context) {\n        var value;\n        value = function() {\n          var possibleValues;\n          possibleValues = sources.map(function(source) {\n            if (typeof source === \"function\") {\n              return source.call(context);\n            } else {\n              return source;\n            }\n          }).filter(function(sourceValue) {\n            return sourceValue != null;\n          });\n          return possibleValues.join(\" \");\n        };\n        return bindObservable(element, value, context, update);\n      })(context);\n    };\n    observeAttribute = function(name, value) {\n      var binding, element, nodeName, _ref;\n      element = top();\n      nodeName = element.nodeName;\n      if (name === \"value\") {\n        valueBind(element, value);\n      } else if (binding = (_ref = specialBindings[nodeName]) != null ? _ref[name] : void 0) {\n        binding(element, value, context);\n      } else if (name.match(/^on/) && isEvent(name.substr(2))) {\n        bindEvent(element, name, value, context);\n      } else if (isEvent(name)) {\n        bindEvent(element, \"on\" + name, value, context);\n      } else {\n        bindObservable(element, value, context, function(newValue) {\n          if ((newValue != null) && newValue !== false) {\n            return element.setAttribute(name, newValue);\n          } else {\n            return element.removeAttribute(name);\n          }\n        });\n      }\n      return element;\n    };\n    observeText = function(value) {\n      var element, update;\n      element = document.createTextNode('');\n      update = function(newValue) {\n        return element.nodeValue = newValue;\n      };\n      bindObservable(element, value, context, update);\n      return render(element);\n    };\n    withContext = function(newContext, newContextTop, fn) {\n      var oldContext;\n      oldContext = context;\n      context = newContext;\n      contextTop = newContextTop;\n      try {\n        return fn();\n      } finally {\n        contextTop = void 0;\n        context = oldContext;\n      }\n    };\n    buffer = function(value) {\n      var _ref, _ref1, _ref2;\n      value = Observable(value, context);\n      switch ((_ref = value()) != null ? _ref.nodeType : void 0) {\n        case 1:\n        case 3:\n        case 11:\n          contentBind(top(), value);\n          return value();\n      }\n      switch ((_ref1 = value()) != null ? (_ref2 = _ref1[0]) != null ? _ref2.nodeType : void 0 : void 0) {\n        case 1:\n        case 3:\n        case 11:\n          return contentBind(top(), value);\n      }\n      return observeText(value);\n    };\n    self = {\n      push: push,\n      pop: pop,\n      id: id,\n      classes: classes,\n      attribute: observeAttribute,\n      text: buffer,\n      filter: function(name, content) {},\n      each: function(items, fn) {\n        var elements, parent, replace;\n        items = Observable(items, context);\n        elements = null;\n        parent = lastParent();\n        items.observe(function() {\n          return replace(elements);\n        });\n        replace = function(oldElements) {\n          elements = [];\n          items.each(function(item, index, array) {\n            var element;\n            element = null;\n            withContext(item, parent, function() {\n              return element = fn.call(item, item, index, array);\n            });\n            if (isFragment(element)) {\n              elements.push.apply(elements, element.childNodes);\n            } else {\n              elements.push(element);\n            }\n            parent.appendChild(element);\n            return element;\n          });\n          return oldElements != null ? oldElements.forEach(remove) : void 0;\n        };\n        return replace(null, items);\n      }\n    };\n    return self;\n  };\n\n  Runtime.VERSION = _dereq_(\"../package.json\").version;\n\n  Runtime.Observable = Observable;\n\n  module.exports = Runtime;\n\n  empty = function(node) {\n    var child, _results;\n    _results = [];\n    while (child = node.firstChild) {\n      _results.push(node.removeChild(child));\n    }\n    return _results;\n  };\n\n  valueIndexOf = function(options, value) {\n    if (typeof value === \"object\") {\n      return options.indexOf(value);\n    } else {\n      return options.map(function(option) {\n        return option.toString();\n      }).indexOf(value.toString());\n    }\n  };\n\n  remove = function(element) {\n    var _ref;\n    cleanup(element);\n    if ((_ref = element.parentNode) != null) {\n      _ref.removeChild(element);\n    }\n  };\n\n}).call(this);\n\n},{\"../package.json\":3,\"o_0\":2}],2:[function(_dereq_,module,exports){\n(function (global){\n!function(){var Observable,autoDeps,computeDependencies,copy,extend,flatten,get,last,magicDependency,remove,splat,withBase,__slice=[].slice;Observable=function(value,context){var changed,fn,listeners,notify,notifyReturning,self;if(typeof(value!=null?value.observe:void 0)===\"function\"){return value}listeners=[];notify=function(newValue){return copy(listeners).forEach(function(listener){return listener(newValue)})};if(typeof value===\"function\"){fn=value;self=function(){magicDependency(self);return value};self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return(_ref=splat(value)).forEach.apply(_ref,args)};changed=function(){value=computeDependencies(self,fn,changed,context);return notify(value)};value=computeDependencies(self,fn,changed,context)}else{self=function(newValue){if(arguments.length>0){if(value!==newValue){value=newValue;notify(newValue)}}else{magicDependency(self)}return value}}self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);if(value!=null){return(_ref=[value]).forEach.apply(_ref,args)}};if(Array.isArray(value)){[\"concat\",\"every\",\"filter\",\"forEach\",\"indexOf\",\"join\",\"lastIndexOf\",\"map\",\"reduce\",\"reduceRight\",\"slice\",\"some\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return value[method].apply(value,args)}});[\"pop\",\"push\",\"reverse\",\"shift\",\"splice\",\"sort\",\"unshift\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];return notifyReturning(value[method].apply(value,args))}});notifyReturning=function(returnValue){notify(value);return returnValue};extend(self,{each:function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];self.forEach.apply(self,args);return self},remove:function(object){var index;index=value.indexOf(object);if(index>=0){return notifyReturning(value.splice(index,1)[0])}},get:function(index){return value[index]},first:function(){return value[0]},last:function(){return value[value.length-1]}})}extend(self,{listeners:listeners,observe:function(listener){return listeners.push(listener)},stopObserving:function(fn){return remove(listeners,fn)},toggle:function(){return self(!value)},increment:function(n){return self(value+n)},decrement:function(n){return self(value-n)},toString:function(){return\"Observable(\"+value+\")\"}});return self};Observable.concat=function(){var args,o;args=1<=arguments.length?__slice.call(arguments,0):[];args=Observable(args);o=Observable(function(){return flatten(args.map(splat))});o.push=args.push;return o};module.exports=Observable;extend=function(){var name,source,sources,target,_i,_len;target=arguments[0],sources=2<=arguments.length?__slice.call(arguments,1):[];for(_i=0,_len=sources.length;_i<_len;_i++){source=sources[_i];for(name in source){target[name]=source[name]}}return target};global.OBSERVABLE_ROOT_HACK=[];autoDeps=function(){return last(global.OBSERVABLE_ROOT_HACK)};magicDependency=function(self){var observerStack;if(observerStack=autoDeps()){return observerStack.push(self)}};withBase=function(self,update,fn){var deps,value,_ref;global.OBSERVABLE_ROOT_HACK.push(deps=[]);try{value=fn();if((_ref=self._deps)!=null){_ref.forEach(function(observable){return observable.stopObserving(update)})}self._deps=deps;deps.forEach(function(observable){return observable.observe(update)})}finally{global.OBSERVABLE_ROOT_HACK.pop()}return value};computeDependencies=function(self,fn,update,context){return withBase(self,update,function(){return fn.call(context)})};remove=function(array,value){var index;index=array.indexOf(value);if(index>=0){return array.splice(index,1)[0]}};copy=function(array){return array.concat([])};get=function(arg){if(typeof arg===\"function\"){return arg()}else{return arg}};splat=function(item){var result,results;results=[];if(typeof item.forEach===\"function\"){item.forEach(function(i){return results.push(i)})}else{result=get(item);if(result!=null){results.push(result)}}return results};last=function(array){return array[array.length-1]};flatten=function(array){return array.reduce(function(a,b){return a.concat(b)},[])}}.call(this);\n}).call(this,typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}],3:[function(_dereq_,module,exports){\nmodule.exports={\n  \"name\": \"hamlet-runtime\",\n  \"version\": \"0.6.0-pre.21\",\n  \"devDependencies\": {\n    \"browserify\": \"^4.1.11\",\n    \"coffee-script\": \"~1.7.1\",\n    \"hamlet-compiler\": \"~0.6.0-pre.11\",\n    \"jsdom\": \"^0.10.5\",\n    \"mocha\": \"~1.12.0\",\n    \"uglify-js\": \"~2.3.6\"\n  },\n  \"dependencies\": {\n    \"o_0\": \"^0.3.1\"\n  },\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"https://github.com/dr-coffee-labs/hamlet-compiler.git\"\n  },\n  \"scripts\": {\n    \"prepublish\": \"script/prepublish\",\n    \"test\": \"script/test\"\n  },\n  \"files\": [\n    \"dist/\"\n  ],\n  \"main\": \"dist/runtime.js\"\n}\n\n},{}]},{},[1])\n(1)\n});",
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
  "dependencies": {
    "require": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "require\n=======\n\nRequire system for self replicating client side apps\n\n[Docs](http://distri.github.io/require/docs)\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Require\n=======\n\nA Node.js compatible require implementation for pure client side apps.\n\nEach file is a module. Modules are responsible for exporting an object. Unlike\ntraditional client side JavaScript, Ruby, or other common languages the module\nis not responsible for naming its product in the context of the requirer. This\nmaintains encapsulation because it is impossible from within a module to know\nwhat external name would be correct to prevent errors of composition in all\npossible uses.\n\nUses\n----\n\nFrom a module require another module in the same package.\n\n>     require \"./soup\"\n\nRequire a module in the parent directory\n\n>     require \"../nuts\"\n\nRequire a module from the root directory in the same package.\n\nNOTE: This could behave slightly differently under Node.js if your package does\nnot have it's own jailed filesystem.\n\n>     require \"/silence\"\n\nFrom a module within a package, require a dependent package.\n\n>     require \"console\"\n\nThe dependency will be delcared something like\n\n>     dependencies:\n>       console: \"http://strd6.github.io/console/v1.2.2.json\"\n\nImplementation\n--------------\n\nFile separator is '/'\n\n    fileSeparator = '/'\n\nIn the browser `global` is `self`.\n\n    global = self\n\nDefault entry point\n\n    defaultEntryPoint = \"main\"\n\nA sentinal against circular requires.\n\n    circularGuard = {}\n\nA top-level module so that all other modules won't have to be orphans.\n\n    rootModule =\n      path: \"\"\n\nRequire a module given a path within a package. Each file is its own separate\nmodule. An application is composed of packages.\n\n    loadPath = (parentModule, pkg, path) ->\n      if startsWith(path, '/')\n        localPath = []\n      else\n        localPath = parentModule.path.split(fileSeparator)\n\n      normalizedPath = normalizePath(path, localPath)\n\n      cache = cacheFor(pkg)\n\n      if module = cache[normalizedPath]\n        if module is circularGuard\n          throw \"Circular dependency detected when requiring #{normalizedPath}\"\n      else\n        cache[normalizedPath] = circularGuard\n\n        try\n          cache[normalizedPath] = module = loadModule(pkg, normalizedPath)\n        finally\n          delete cache[normalizedPath] if cache[normalizedPath] is circularGuard\n\n      return module.exports\n\nTo normalize the path we convert local paths to a standard form that does not\ncontain an references to current or parent directories.\n\n    normalizePath = (path, base=[]) ->\n      base = base.concat path.split(fileSeparator)\n      result = []\n\nChew up all the pieces into a standardized path.\n\n      while base.length\n        switch piece = base.shift()\n          when \"..\"\n            result.pop()\n          when \"\", \".\"\n            # Skip\n          else\n            result.push(piece)\n\n      return result.join(fileSeparator)\n\n`loadPackage` Loads a dependent package at that packages entry point.\n\n    loadPackage = (pkg) ->\n      path = pkg.entryPoint or defaultEntryPoint\n\n      loadPath(rootModule, pkg, path)\n\nLoad a file from within a package.\n\n    loadModule = (pkg, path) ->\n      unless (file = pkg.distribution[path])\n        throw \"Could not find file at #{path} in #{pkg.name}\"\n\n      program = annotateSourceURL file.content, pkg, path\n      dirname = path.split(fileSeparator)[0...-1].join(fileSeparator)\n\n      module =\n        path: dirname\n        exports: {}\n\nThis external context provides some variable that modules have access to.\n\nA `require` function is exposed to modules so they may require other modules.\n\nAdditional properties such as a reference to the global object and some metadata\nare also exposed.\n\n      context =\n        require: generateRequireFn(pkg, module)\n        global: global\n        module: module\n        exports: module.exports\n        PACKAGE: pkg\n        __filename: path\n        __dirname: dirname\n\n      args = Object.keys(context)\n      values = args.map (name) -> context[name]\n\nExecute the program within the module and given context.\n\n      Function(args..., program).apply(module, values)\n\n      return module\n\nHelper to detect if a given path is a package.\n\n    isPackage = (path) ->\n      if !(startsWith(path, fileSeparator) or\n        startsWith(path, \".#{fileSeparator}\") or\n        startsWith(path, \"..#{fileSeparator}\")\n      )\n        path.split(fileSeparator)[0]\n      else\n        false\n\nGenerate a require function for a given module in a package.\n\nIf we are loading a package in another module then we strip out the module part\nof the name and use the `rootModule` rather than the local module we came from.\nThat way our local path won't affect the lookup path in another package.\n\nLoading a module within our package, uses the requiring module as a parent for\nlocal path resolution.\n\n    generateRequireFn = (pkg, module=rootModule) ->\n      pkg.name ?= \"ROOT\"\n      pkg.scopedName ?= \"ROOT\"\n\n      (path) ->\n        if isPackage(path)\n          unless otherPackage = pkg.dependencies[path]\n            throw \"Package: #{path} not found.\"\n\n          otherPackage.name ?= path\n          otherPackage.scopedName ?= \"#{pkg.scopedName}:#{path}\"\n\n          loadPackage(otherPackage)\n        else\n          loadPath(module, pkg, path)\n\nBecause we can't actually `require('require')` we need to export it a little\ndifferently.\n\n    if exports?\n      exports.generateFor = generateRequireFn\n    else\n      global.Require =\n        generateFor: generateRequireFn\n\nNotes\n-----\n\nWe have to use `pkg` as a variable name because `package` is a reserved word.\n\nNode needs to check file extensions, but because we only load compiled products\nwe never have extensions in our path.\n\nSo while Node may need to check for either `path/somefile.js` or `path/somefile.coffee`\nthat will already have been resolved for us and we will only check `path/somefile`\n\nCircular dependencies are not allowed and raise an exception when detected.\n\nHelpers\n-------\n\nDetect if a string starts with a given prefix.\n\n    startsWith = (string, prefix) ->\n      string.lastIndexOf(prefix, 0) is 0\n\nCreates a cache for modules within a package. It uses `defineProperty` so that\nthe cache doesn't end up being enumerated or serialized to json.\n\n    cacheFor = (pkg) ->\n      return pkg.cache if pkg.cache\n\n      Object.defineProperty pkg, \"cache\",\n        value: {}\n\n      return pkg.cache\n\nAnnotate a program with a source url so we can debug in Chrome's dev tools.\n\n    annotateSourceURL = (program, pkg, path) ->\n      \"\"\"\n        #{program}\n        //# sourceURL=#{pkg.scopedName}/#{path}\n      \"\"\"\n\nDefinitions\n-----------\n\n### Module\n\nA module is a file.\n\n### Package\n\nA package is an aggregation of modules. A package is a json object with the\nfollowing properties:\n\n- `distribution` An object whose keys are paths and properties are `fileData`\n- `entryPoint` Path to the primary module that requiring this package will require.\n- `dependencies` An object whose keys are names and whose values are packages.\n\nIt may have additional properties such as `source`, `repository`, and `docs`.\n\n### Application\n\nAn application is a package which has an `entryPoint` and may have dependencies.\nAdditionally an application's dependencies may have dependencies. Dependencies\nmust be bundled with the package.\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.4.3-pre.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/circular.coffee": {
          "path": "samples/circular.coffee",
          "content": "# This test file illustrates a circular requirement and should throw an error.\n\nrequire \"./circular\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/random.coffee": {
          "path": "samples/random.coffee",
          "content": "# Returns a random value, used for testing caching\n\nmodule.exports = Math.random()\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/terminal.coffee": {
          "path": "samples/terminal.coffee",
          "content": "# A test file for requiring a file that has no dependencies. It should succeed.\n\nexports.something = true\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/throws.coffee": {
          "path": "samples/throws.coffee",
          "content": "# A test file that throws an error.\n\nthrow \"yolo\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/require.coffee.md": {
          "path": "test/require.coffee.md",
          "content": "Testing out this crazy require thing\n\n    # Load our latest require code for testing\n    # NOTE: This causes the root for relative requires to be at the root dir, not the test dir\n    latestRequire = require('/main').generateFor(PACKAGE)\n\n    describe \"PACKAGE\", ->\n      it \"should be named 'ROOT'\", ->\n        assert.equal PACKAGE.name, \"ROOT\"\n\n    describe \"require\", ->\n      it \"should not exist globally\", ->\n        assert !global.require\n\n      it \"should be able to require a file that exists with a relative path\", ->\n        assert latestRequire('/samples/terminal')\n\n      it \"should get whatever the file exports\", ->\n        assert latestRequire('/samples/terminal').something\n\n      it \"should not get something the file doesn't export\", ->\n        assert !latestRequire('/samples/terminal').something2\n\n      it \"should throw a descriptive error when requring circular dependencies\", ->\n        assert.throws ->\n          latestRequire('/samples/circular')\n        , /circular/i\n\n      it \"should throw a descriptive error when requiring a package that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"does_not_exist\"\n        , /not found/i\n\n      it \"should throw a descriptive error when requiring a relative path that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"/does_not_exist\"\n        , /Could not find file/i\n\n      it \"should recover gracefully enough from requiring files that throw errors\", ->\n        assert.throws ->\n          latestRequire \"/samples/throws\"\n\n        assert.throws ->\n          latestRequire \"/samples/throws\"\n        , (err) ->\n          !/circular/i.test err\n\n      it \"should cache modules\", ->\n        result = require(\"/samples/random\")\n\n        assert.equal require(\"/samples/random\"), result\n\n    describe \"module context\", ->\n      it \"should know __dirname\", ->\n        assert.equal \"test\", __dirname\n\n      it \"should know __filename\", ->\n        assert __filename\n\n      it \"should know its package\", ->\n        assert PACKAGE\n\n    describe \"dependent packages\", ->\n      PACKAGE.dependencies[\"test-package\"] =\n        distribution:\n          main:\n            content: \"module.exports = PACKAGE.name\"\n\n      PACKAGE.dependencies[\"strange/name\"] =\n        distribution:\n          main:\n            content: \"\"\n\n      it \"should raise an error when requiring a package that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"nonexistent\"\n        , (err) ->\n          /nonexistent/i.test err\n\n      it \"should be able to require a package that exists\", ->\n        assert latestRequire(\"test-package\")\n\n      it \"Dependent packages should know their names when required\", ->\n        assert.equal latestRequire(\"test-package\"), \"test-package\"\n\n      it \"should be able to require by pretty much any name\", ->\n        assert latestRequire(\"strange/name\")\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,\n    __slice = [].slice;\n\n  fileSeparator = '/';\n\n  global = self;\n\n  defaultEntryPoint = \"main\";\n\n  circularGuard = {};\n\n  rootModule = {\n    path: \"\"\n  };\n\n  loadPath = function(parentModule, pkg, path) {\n    var cache, localPath, module, normalizedPath;\n    if (startsWith(path, '/')) {\n      localPath = [];\n    } else {\n      localPath = parentModule.path.split(fileSeparator);\n    }\n    normalizedPath = normalizePath(path, localPath);\n    cache = cacheFor(pkg);\n    if (module = cache[normalizedPath]) {\n      if (module === circularGuard) {\n        throw \"Circular dependency detected when requiring \" + normalizedPath;\n      }\n    } else {\n      cache[normalizedPath] = circularGuard;\n      try {\n        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);\n      } finally {\n        if (cache[normalizedPath] === circularGuard) {\n          delete cache[normalizedPath];\n        }\n      }\n    }\n    return module.exports;\n  };\n\n  normalizePath = function(path, base) {\n    var piece, result;\n    if (base == null) {\n      base = [];\n    }\n    base = base.concat(path.split(fileSeparator));\n    result = [];\n    while (base.length) {\n      switch (piece = base.shift()) {\n        case \"..\":\n          result.pop();\n          break;\n        case \"\":\n        case \".\":\n          break;\n        default:\n          result.push(piece);\n      }\n    }\n    return result.join(fileSeparator);\n  };\n\n  loadPackage = function(pkg) {\n    var path;\n    path = pkg.entryPoint || defaultEntryPoint;\n    return loadPath(rootModule, pkg, path);\n  };\n\n  loadModule = function(pkg, path) {\n    var args, context, dirname, file, module, program, values;\n    if (!(file = pkg.distribution[path])) {\n      throw \"Could not find file at \" + path + \" in \" + pkg.name;\n    }\n    program = annotateSourceURL(file.content, pkg, path);\n    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);\n    module = {\n      path: dirname,\n      exports: {}\n    };\n    context = {\n      require: generateRequireFn(pkg, module),\n      global: global,\n      module: module,\n      exports: module.exports,\n      PACKAGE: pkg,\n      __filename: path,\n      __dirname: dirname\n    };\n    args = Object.keys(context);\n    values = args.map(function(name) {\n      return context[name];\n    });\n    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);\n    return module;\n  };\n\n  isPackage = function(path) {\n    if (!(startsWith(path, fileSeparator) || startsWith(path, \".\" + fileSeparator) || startsWith(path, \"..\" + fileSeparator))) {\n      return path.split(fileSeparator)[0];\n    } else {\n      return false;\n    }\n  };\n\n  generateRequireFn = function(pkg, module) {\n    if (module == null) {\n      module = rootModule;\n    }\n    if (pkg.name == null) {\n      pkg.name = \"ROOT\";\n    }\n    if (pkg.scopedName == null) {\n      pkg.scopedName = \"ROOT\";\n    }\n    return function(path) {\n      var otherPackage;\n      if (isPackage(path)) {\n        if (!(otherPackage = pkg.dependencies[path])) {\n          throw \"Package: \" + path + \" not found.\";\n        }\n        if (otherPackage.name == null) {\n          otherPackage.name = path;\n        }\n        if (otherPackage.scopedName == null) {\n          otherPackage.scopedName = \"\" + pkg.scopedName + \":\" + path;\n        }\n        return loadPackage(otherPackage);\n      } else {\n        return loadPath(module, pkg, path);\n      }\n    };\n  };\n\n  if (typeof exports !== \"undefined\" && exports !== null) {\n    exports.generateFor = generateRequireFn;\n  } else {\n    global.Require = {\n      generateFor: generateRequireFn\n    };\n  }\n\n  startsWith = function(string, prefix) {\n    return string.lastIndexOf(prefix, 0) === 0;\n  };\n\n  cacheFor = function(pkg) {\n    if (pkg.cache) {\n      return pkg.cache;\n    }\n    Object.defineProperty(pkg, \"cache\", {\n      value: {}\n    });\n    return pkg.cache;\n  };\n\n  annotateSourceURL = function(program, pkg, path) {\n    return \"\" + program + \"\\n//# sourceURL=\" + pkg.scopedName + \"/\" + path;\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.4.3-pre.0\"};",
          "type": "blob"
        },
        "samples/circular": {
          "path": "samples/circular",
          "content": "(function() {\n  require(\"./circular\");\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/random": {
          "path": "samples/random",
          "content": "(function() {\n  module.exports = Math.random();\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/terminal": {
          "path": "samples/terminal",
          "content": "(function() {\n  exports.something = true;\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/throws": {
          "path": "samples/throws",
          "content": "(function() {\n  throw \"yolo\";\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/require": {
          "path": "test/require",
          "content": "(function() {\n  var latestRequire;\n\n  latestRequire = require('/main').generateFor(PACKAGE);\n\n  describe(\"PACKAGE\", function() {\n    return it(\"should be named 'ROOT'\", function() {\n      return assert.equal(PACKAGE.name, \"ROOT\");\n    });\n  });\n\n  describe(\"require\", function() {\n    it(\"should not exist globally\", function() {\n      return assert(!global.require);\n    });\n    it(\"should be able to require a file that exists with a relative path\", function() {\n      return assert(latestRequire('/samples/terminal'));\n    });\n    it(\"should get whatever the file exports\", function() {\n      return assert(latestRequire('/samples/terminal').something);\n    });\n    it(\"should not get something the file doesn't export\", function() {\n      return assert(!latestRequire('/samples/terminal').something2);\n    });\n    it(\"should throw a descriptive error when requring circular dependencies\", function() {\n      return assert.throws(function() {\n        return latestRequire('/samples/circular');\n      }, /circular/i);\n    });\n    it(\"should throw a descriptive error when requiring a package that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"does_not_exist\");\n      }, /not found/i);\n    });\n    it(\"should throw a descriptive error when requiring a relative path that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"/does_not_exist\");\n      }, /Could not find file/i);\n    });\n    it(\"should recover gracefully enough from requiring files that throw errors\", function() {\n      assert.throws(function() {\n        return latestRequire(\"/samples/throws\");\n      });\n      return assert.throws(function() {\n        return latestRequire(\"/samples/throws\");\n      }, function(err) {\n        return !/circular/i.test(err);\n      });\n    });\n    return it(\"should cache modules\", function() {\n      var result;\n      result = require(\"/samples/random\");\n      return assert.equal(require(\"/samples/random\"), result);\n    });\n  });\n\n  describe(\"module context\", function() {\n    it(\"should know __dirname\", function() {\n      return assert.equal(\"test\", __dirname);\n    });\n    it(\"should know __filename\", function() {\n      return assert(__filename);\n    });\n    return it(\"should know its package\", function() {\n      return assert(PACKAGE);\n    });\n  });\n\n  describe(\"dependent packages\", function() {\n    PACKAGE.dependencies[\"test-package\"] = {\n      distribution: {\n        main: {\n          content: \"module.exports = PACKAGE.name\"\n        }\n      }\n    };\n    PACKAGE.dependencies[\"strange/name\"] = {\n      distribution: {\n        main: {\n          content: \"\"\n        }\n      }\n    };\n    it(\"should raise an error when requiring a package that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"nonexistent\");\n      }, function(err) {\n        return /nonexistent/i.test(err);\n      });\n    });\n    it(\"should be able to require a package that exists\", function() {\n      return assert(latestRequire(\"test-package\"));\n    });\n    it(\"Dependent packages should know their names when required\", function() {\n      return assert.equal(latestRequire(\"test-package\"), \"test-package\");\n    });\n    return it(\"should be able to require by pretty much any name\", function() {\n      return assert(latestRequire(\"strange/name\"));\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.4.3-pre.0",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.4.3-pre.0",
        "default_branch": "master",
        "full_name": "distri/require",
        "homepage": null,
        "description": "Require system for self replicating client side apps",
        "html_url": "https://github.com/distri/require",
        "url": "https://api.github.com/repos/distri/require",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "util": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "util\n====\n\nSmall utility methods for JS\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.0\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.0\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.0",
      "entryPoint": "main",
      "repository": {
        "id": 18501018,
        "name": "util",
        "full_name": "distri/util",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/util",
        "description": "Small utility methods for JS",
        "fork": false,
        "url": "https://api.github.com/repos/distri/util",
        "forks_url": "https://api.github.com/repos/distri/util/forks",
        "keys_url": "https://api.github.com/repos/distri/util/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/util/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/util/teams",
        "hooks_url": "https://api.github.com/repos/distri/util/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/util/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/util/events",
        "assignees_url": "https://api.github.com/repos/distri/util/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/util/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/util/tags",
        "blobs_url": "https://api.github.com/repos/distri/util/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/util/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/util/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/util/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/util/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/util/languages",
        "stargazers_url": "https://api.github.com/repos/distri/util/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/util/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/util/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/util/subscription",
        "commits_url": "https://api.github.com/repos/distri/util/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/util/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/util/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/util/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/util/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/util/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/util/merges",
        "archive_url": "https://api.github.com/repos/distri/util/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/util/downloads",
        "issues_url": "https://api.github.com/repos/distri/util/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/util/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/util/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/util/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/util/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/util/releases{/id}",
        "created_at": "2014-04-06T22:42:56Z",
        "updated_at": "2014-04-06T22:42:56Z",
        "pushed_at": "2014-04-06T22:42:56Z",
        "git_url": "git://github.com/distri/util.git",
        "ssh_url": "git@github.com:distri/util.git",
        "clone_url": "https://github.com/distri/util.git",
        "svn_url": "https://github.com/distri/util",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.0",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});