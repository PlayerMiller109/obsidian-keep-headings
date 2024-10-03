const newEditor = (app)=> {
  const md = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
  md.load(); md.editable = !0; md.showEditor()
  const mEditor = Object.getPrototypeOf(Object.getPrototypeOf(md.editMode)).constructor
  md.unload()
  return e = new mEditor(app, createDiv(), {
    app, scroll: 0, editMode: null,
    get editor() { return e.editor },
    get file() { return app.workspace.getActiveFile() },
    getMode() { return 'source' },
    showSearch() {},
    toggleMode() {},
    onMarkdownScroll() {},
  })
}
const import_modHN = (app, ob)=> {
  const e = newEditor(app); e.load()
  const modHN = (evt)=> {
    if (evt.ctrlKey || evt.altKey) return; const { target, view: {document} } = evt
    , lineEl = document.querySelector('.cm-editor.cm-focused .cm-active.HyperMD-header.cm-line')
    if (
      target === lineEl ||
      (target.classList.contains('cm-header') && !target.classList.contains('cm-formatting'))
    ) {
      const editor5 = app.workspace.activeEditor.editor
      , cs = editor5.getCursor()
      , leadCh = editor5.getLine(cs.line).indexOf(' ')
      , startOffset = cs.ch - leadCh - 1
      app.commands.executeCommandById('editor:rename-heading')
      const parent = document.querySelector('.modal-container')
      const rEl = parent.querySelector('.rename-textarea')

      const okEl = parent.querySelector('button.mod-cta')
      , exitEl = parent.querySelector('button.mod-cancel')
      const submit = ()=> {
        const [newHeading, nextLine] = e.editor.getValue().split('\n').filter(p=> p)
        if (rEl.value == newHeading) { exitEl.click(); return }
        if (newHeading) rEl.value = newHeading
        if (nextLine) setTimeout(()=> {
          const pos = {line: cs.line + 1, ch: 0}
          editor5.replaceRange(nextLine + '\n', pos)
          editor5.setCursor(pos)
        }, 50)
        okEl.click()
      }

      parent.empty()
      const bgEl = parent.createDiv('kh-bg')
      bgEl.onclick = submit
      bgEl.setCssProps({width: '100%', height: '100%'})

      parent.append(e.containerEl)
      e.containerEl.onkeydown = evt=> {
        if (evt.ctrlKey) app.workspace.activeLeaf = null
        if (evt.key == 'Enter') submit()
      }
      const rect = lineEl.getBoundingClientRect()
      e.containerEl.setCssProps({
        position: 'absolute',
        left: `${rect.left}px`, top: `${rect.top}px`,
        width: `${rect.width}px`, height: `${rect.height}px`,
        background: 'var(--background-secondary)',
      })
      e.set(rEl.value); e.focus(); e.editor.setCursor(0, startOffset)
    }
  }
  , modHN2 = (ob.debounce)(modHN)
  return function() {
    this.registerEvent(
      app.workspace.on('active-leaf-change', leaf=> {
        const { view } = leaf; if (!view?.contentEl) return
        this.registerDomEvent(
          view.contentEl.ownerDocument, 'click', modHN2
        )
      })
    )
  }
}
const ob = require('obsidian')
module.exports = class extends ob.Plugin {
  onload() {
    import_modHN(this.app, ob).call(this)
  }
  onunload() {}
}