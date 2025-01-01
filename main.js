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
const OfficialModal = class {
  constructor(document) {
    this.parent = document.querySelector('.modal-container')
    this.rEl = this.parent.querySelector('.rename-textarea')
    this.okBtn = this.parent.querySelector('button.mod-cta')
    this.cancelBtn = this.parent.querySelector('button.mod-cancel')
  }
  getData = ()=> this.rEl.value
  setData = (data)=> this.rEl.value = data
  submit = ()=> this.okBtn.click()
  cancel = ()=> this.cancelBtn.click()
}
const PluginEMode = class {
  constructor(app) {
    const eMode = newEMode(app)
    this.setup = (data, offset)=> {
      eMode.set(data); eMode.focus()
      eMode.editor.setCursor(0, offset)
    }
    Object.assign(this, eMode)
  }
  getLines = ()=> this.editor.getValue().split('\n').filter(p=> p)
  align = (lineEl)=> {
    const rect = lineEl.getBoundingClientRect()
    this.containerEl.setCssProps({
      position: 'absolute',
      left: `${rect.left}px`, width: `${rect.width}px`,
      top: `${rect.top}px`, height: `${rect.height}px`,
      background: 'var(--background-secondary)',
    })
  }
}
const snapMainEditor = (app)=> new class {
  editor = app.workspace.activeEditor.editor
  cs = this.editor.getCursor()
  leadCh = this.editor.getLine(this.cs.line).indexOf(' ')
  startOffset = this.cs.ch - this.leadCh - 1
}
const newPluginModal = (app, document)=> new class {
  constructor() {
    this.snap = snapMainEditor(app)
    app.commands.executeCommandById('editor:rename-heading')
    const official = new OfficialModal(document)
    Object.assign(this, official)
  }
  eMode = new PluginEMode(app)
  show = ()=> {
    const { parent } = this; parent.empty()
    // addSubmitArea
    parent.onclick = evt=> {evt.stopPropagation()}
    parent.createDiv({
      cls: 'kh-bg', onclick: this.submitData,
      attr: {style: 'width: 100%; height: 100%;'},
    })
    // addRenameEditor
    parent.append(this.eMode.containerEl)
    this.eMode.containerEl.onkeydown = evt=> {
      if (evt.ctrlKey) app.workspace.activeLeaf = null
      if (evt.key == 'Enter') this.submitData()
    }
    this.eMode.setup(this.getData(), this.snap.startOffset)
  }
  submitData = ()=> {
    const [newHeading, nextLine] = this.eMode.getLines()

    if (this.getData() == newHeading) { this.cancel(); return }
    if (newHeading) { this.setData(newHeading) }
    this.submit()

    if (nextLine) {
      const { editor, cs, leadCh } = this.snap
      setTimeout(()=> {
        editor.replaceRange(
          `\n${nextLine}`,
          {line: cs.line, ch: leadCh + newHeading.length + 1}
        )
        editor.setCursor({line: cs.line + 1, ch: 0})
      }, 100)
    }
  }
}
const import_modHN = (app, ob)=> {
  const modHN = (evt)=> {
    if (evt.ctrlKey || evt.altKey) return; const { target, view: {document} } = evt
    , lineEl = document.querySelector('.cm-editor.cm-focused .cm-active.HyperMD-header.cm-line')
    if (
      target === lineEl ||
      (target.classList.contains('cm-header') && !target.classList.contains('cm-formatting'))
    ) {
      const modal = newPluginModal(app, document)
      modal.eMode.align(lineEl); modal.show()
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