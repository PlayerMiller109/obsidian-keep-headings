const newEditMode = (app)=> {
  const _m = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
  _m.load(); _m.editable = !0; _m.showEditor()
  const EditMode = Object.getPrototypeOf(Object.getPrototypeOf(_m.editMode)).constructor
  _m.unload()

  let eMode
  eMode = new EditMode(app, createDiv(), {
    app, scroll: 0, editMode: null,
    get editor() { return eMode.editor },
    get file() {},
    getMode: ()=> 'source',
    onMarkdownScroll: ()=> {},
    showSearch: ()=> {},
    toggleMode: ()=> {},
  })

  return Object.assign(eMode, new class {
    setup = (data, offset)=> {
      eMode.set(data); eMode.focus()
      eMode.editor.setCursor(0, offset)
    }
    getLines = ()=> eMode.editor.getValue().split('\n').filter(p=> p)
    align = (lineEl)=> {
      const rect = lineEl.getBoundingClientRect()
      eMode.containerEl.setCssProps({
        position: 'absolute',
        left: `${rect.left}px`, width: `${rect.width}px`,
        top: `${rect.top}px`, height: `${rect.height}px`,
        background: 'var(--background-secondary)',
      })
    }
  })
}

const snapMainEditor = (app)=> new class {
  editor = app.workspace.activeEditor.editor
  cs = this.editor.getCursor()
  leadCh = this.editor.getLine(this.cs.line).indexOf(' ')
  startOffset = this.cs.ch - this.leadCh - 1
}
const newPluginModal = (app, eMode)=> new class {
  main = (document)=> {
    this.snap = snapMainEditor(app)
    this.extendsOfficialModal(document)
  }
  extendsOfficialModal = (document)=> {
    app.commands.executeCommandById('editor:rename-heading')
    const container = document.querySelector('.modal-container')
    this.oModal = new class {
      rnEl = container.querySelector('.rename-textarea')
      saveBtn = container.querySelector('button.mod-cta')
      cancelBtn = container.querySelector('button.mod-cancel')
      getData = ()=> this.rnEl.value
      setData = (data)=> this.rnEl.value = data
      submit = ()=> { this.saveBtn.click() }
      cancel = ()=> { this.cancelBtn.click() }
    }
    container.empty()

    // addSubmitArea
    container.onclick = (evt)=> {evt.stopPropagation()}
    container.createDiv({
      cls: 'kh-bg', onclick: ()=> this.submitData(),
      attr: {style: 'width: 100%; height: 100%;'},
    })
    // addRenameEditor
    container.append(eMode.containerEl)
    eMode.containerEl.onkeydown = (evt)=> {
      if (evt.ctrlKey || evt.key == 'Escape') {
        // enable the switch of activeEditor
        app.workspace.activeEditor = null
      }
      if (evt.key == 'Enter') this.submitData()
    }
    eMode.setup(this.oModal.getData(), this.snap.startOffset)
  }
  submitData = ()=> {
    app.workspace.activeEditor = null // you need this since 1.8.3
    const [newHeading, nextLine] = eMode.getLines()

    if (this.oModal.getData() == newHeading) {
      this.oModal.cancel(); return
    }
    if (newHeading) { this.oModal.setData(newHeading) }
    this.oModal.submit()

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
const import_modHN = (plg, ob)=> {
  const { app } = plg
  const eMode = newEditMode(app)
  const modHN = (evt)=> {
    if (evt.ctrlKey || evt.altKey) return
    const { target, view: {document} } = evt
    const lineEl = document.querySelector('.cm-editor.cm-focused .cm-active.HyperMD-header')
    if (
      (target.classList.contains('cm-header') && !target.classList.contains('cm-formatting'))
    ) {
      eMode.align(lineEl)
      newPluginModal(app, eMode).main(document)
    }
  }
  const modHN2 = (ob.debounce)(modHN)
  plg.registerDomEvent(document, 'click', modHN2)
  plg.registerEvent(
    app.workspace.on('window-open', (win)=> {
      plg.registerDomEvent(win.doc, 'click', modHN2)
    })
  )
}

const ob = require('obsidian')
module.exports = class extends ob.Plugin {
  onload() {
    import_modHN(this, ob)
  }
  onunload() {}
}