const newEMode = (app)=> {
  const md = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
  md.load(); md.editable = !0; md.showEditor()
  const EMode = Object.getPrototypeOf(Object.getPrototypeOf(md.editMode)).constructor
  md.unload(); let eMode
  return eMode = new EMode(app, createDiv(), {
    app, scroll: 0, editMode: null,
    get editor() { return eMode.editor },
    get file() {},
    getMode() { return 'source' },
    showSearch() {},
    toggleMode() {},
    onMarkdownScroll() {},
  })
}
const import_modHN = (app, ob)=> {
  const eMode = newEMode(app); eMode.load()
  const modHN = (evt)=> {
    if (evt.ctrlKey || evt.altKey) return; const { target, view: {document} } = evt
    , lineEl = document.querySelector('.cm-editor.cm-focused .cm-active.HyperMD-header.cm-line')
    if (
      target === lineEl ||
      (target.classList.contains('cm-header') && !target.classList.contains('cm-formatting'))
    ) {
      const { editor } = app.workspace.activeEditor
      , cs = editor.getCursor()
      , leadCh = editor.getLine(cs.line).indexOf(' ')
      , startOffset = cs.ch - leadCh - 1
      app.commands.executeCommandById('editor:rename-heading')
      const parent = document.querySelector('.modal-container')
      const rEl = parent.querySelector('.rename-textarea')

      const okBtn = parent.querySelector('button.mod-cta')
      , cancelBtn = parent.querySelector('button.mod-cancel')
      const submit = ()=> {
        const [newHeading, nextLine] = eMode.editor.getValue().split('\n').filter(p=> p)
        if (rEl.value == newHeading) { cancelBtn.click(); return }
        if (newHeading) rEl.value = newHeading; okBtn.click()
        if (nextLine) setTimeout(()=> {
          editor.replaceRange(
            `\n${nextLine}`,
            {line: cs.line, ch: leadCh + newHeading.length + 1}
          )
          editor.setCursor({line: cs.line + 1, ch: 0})
        }, 100)
      }

      parent.empty()
      parent.onclick = evt=> {evt.stopPropagation()}
      parent.createDiv({
        cls: 'kh-bg', onclick: submit,
        attr: {style: 'width: 100%; height: 100%;'},
      })

      parent.append(eMode.containerEl)
      eMode.containerEl.onkeydown = evt=> {
        if (evt.ctrlKey) app.workspace.activeLeaf = null
        if (evt.key == 'Enter') submit()
      }
      const rect = lineEl.getBoundingClientRect()
      eMode.containerEl.setCssProps({
        position: 'absolute',
        left: `${rect.left}px`, top: `${rect.top}px`,
        width: `${rect.width}px`, height: `${rect.height}px`,
        background: 'var(--background-secondary)',
      })
      eMode.set(rEl.value); eMode.focus()
      eMode.editor.setCursor(0, startOffset)
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