const getEditMode = (app)=> {
  const md = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
  md.load(); md.editable = !0; md.showEditor()
  const EMode = Object.getPrototypeOf(Object.getPrototypeOf(md.editMode)).constructor
  md.unload(); let eMode
  eMode = new EMode(app, createDiv(), {
    app, scroll: 0, editMode: null,
    get editor() { return eMode.editor },
    get file() {},
    getMode() { return 'source' },
    showSearch() {},
    toggleMode() {},
    onMarkdownScroll() {},
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
      rEl = container.querySelector('.rename-textarea')
      okBtn = container.querySelector('button.mod-cta')
      cancelBtn = container.querySelector('button.mod-cancel')
      getData = ()=> this.rEl.value
      setData = (data)=> this.rEl.value = data
      submit = ()=> { this.okBtn.click(); this.destroy() }
      cancel = ()=> { this.cancelBtn.click(); this.destroy() }
      destroy = ()=> {
        this.rEl = this.okBtn = this.cancelBtn = null
      }
    }
    container.empty()

    // addSubmitArea
    container.onclick = evt=> {evt.stopPropagation()}
    container.createDiv({
      cls: 'kh-bg', onclick: this.submitData,
      attr: {style: 'width: 100%; height: 100%;'},
    })
    // addRenameEditor
    container.append(eMode.containerEl)
    eMode.containerEl.onkeydown = evt=> {
      if (evt.ctrlKey) app.workspace.activeLeaf = null // enable the switch of activeleaf
      if (evt.key == 'Enter') this.submitData()
    }
    eMode.setup(this.oModal.getData(), this.snap.startOffset)
  }
  submitData = ()=> {
    app.workspace.activeLeaf = null // you need this in 1.8.3
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
const import_modHN = (app, ob)=> {
  const eMode = getEditMode(app)
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