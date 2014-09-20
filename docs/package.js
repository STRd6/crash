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
      "content": "We need to bootstrap our whole system.\n\nCommands for testing\n\n    commands = {}\n\n    [\"echo\", \"cat\"].forEach (name) ->\n      commands[name] = PACKAGE.distribution[name].content\n\nRun a command from the cli\n\n    STDOUT = (value) ->\n      # TODO: Do something for real\n      console.log value\n\n    # TODO: Implement for real\n    STDIN = (handler) ->\n\n    exec = (command) ->\n      [command, args...] = command.split /\\s/\n\n      exe = commands[command]\n      Function(\"$PROGRAM_NAME\", \"ARGV\", \"STDOUT\", \"STDIN\", exe)(command, args, STDOUT, STDIN)\n\nRun a subshell.\n\nRun a 'GUI' app.\n\nRun a 'Terminal' app.\n\n    # TODO: Handle pipe\n    exec 'echo hello | cat'\n\nPipe input to output among running apps.\n\nList running processes.\n\nKill processes.\n\nExplore a filesystem.\n\nSTDIO\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies: \n  require: \"distri/require:v0.4.3-pre.0\"\n",
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
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"require\":\"distri/require:v0.4.3-pre.0\"}};",
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
    }
  }
});