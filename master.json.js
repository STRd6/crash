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
      "content": "We need to bootstrap our whole system.\n\nRun a subshell.\n\nRun a 'GUI' app.\n\nRun a 'Terminal' app.\n\nPipe input to output among running apps.\n\nList running processes.\n\nKill processes.\n\nSTDIO\n\n    alert 'hey'\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  alert('hey');\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"]};",
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