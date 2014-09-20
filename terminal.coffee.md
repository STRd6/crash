Terminal
========

Execute input and display output.

    {applyStylesheet} = require "util"

    template = require "./templates/terminal"

    module.exports = ({STDIN, STDOUT}) ->
      model =
        submit: (event) ->
          event.preventDefault()

          command = input.value
          input.value = ""

          STDIN(command)

          input.value = ""

      STDOUT (data) ->
        pre.textContent += data + "\n"

      applyStylesheet(require("./style/terminal"), "terminal")

      element = template(model)

      document.body.appendChild element

      input = element.getElementsByTagName("input")[0]
      pre = element.getElementsByTagName("pre")[0]

      return element