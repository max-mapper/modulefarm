var marked = require('marked')

module.exports = function parseMarkdown (src) {
  var tokens = marked.lexer(src.toString())
  var result = []
  var current = null

  while (tokens.length) {
    var t = tokens.shift()

    if (t.type === 'heading') {
      if (t.depth === 2) {
        current = {name: t.text, modules: []}
        result.push(current)
      } else {
        current = null
      }
      continue
    }

    if (!current) continue

    if (t.type === 'list_item_start') {
      var txt = tokens.shift()
      if (txt.type === 'text') {
        var link = txt.text.match(/\[(.+)\]\((.+)\)/)
        if (!link) continue
        current.modules.push({name: link[1], url: link[2]})
      }
    }
  }

  return result
}
