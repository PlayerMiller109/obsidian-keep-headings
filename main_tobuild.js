const ob = require('obsidian')
const { EditorView, keymap } = require('@codemirror/view')
const { EditorSelection, Prec } = require('@codemirror/state')
module.exports = class extends ob.Plugin {
  onload() {
    this.MarkdownEditor = require('./mEditor/MarkdownEditor.js')({ob, EditorView})
    const modHN = require('./mEditor/modHN.js'); modHN(this, ob)
  }
  onunload() {}
}