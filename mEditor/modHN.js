const snapMainEditor = (app)=> new class {
  editor = app.workspace.activeEditor.editor
  cs = this.editor.getCursor()
  leadCh = this.editor.getLine(this.cs.line).indexOf(' ')
  startOffset = this.cs.ch - this.leadCh - 1
}
const newPluginModal = (app, mEditor)=> new class {
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
      submit = ()=> { mEditor.destroy(); this.saveBtn.click() }
      cancel = ()=> { mEditor.destroy(); this.cancelBtn.click() }
    }
    container.empty()

    // addSubmitArea
    container.onclick = (evt)=> {evt.stopPropagation()}
    container.createDiv({
      cls: 'kh-bg', onclick: ()=> this.submitData(),
      attr: {style: 'width: 100%; height: 100%;'},
    })
    // addRenameEditor
    container.append(mEditor.containerEl)
    mEditor.containerEl.onkeydown = (evt)=> {
      if (evt.key == 'Escape') this.oModal.cancel()
      if (evt.key == 'Enter') this.submitData(evt.shiftKey)
    }
    mEditor.setup(this.oModal.getData(), this.snap.startOffset)
  }
  submitData = (shouldSplit)=> {
    const cont = mEditor.value
    let newHeading, nextLine
    if (shouldSplit) {
      [newHeading, nextLine] = cont.split('\n')
    }
    else newHeading = cont.replaceAll('\n', '')

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
module.exports = (plg, ob)=> {
  const { app, MarkdownEditor } = plg
  const modHN = (evt)=> {
    if (evt.ctrlKey || evt.altKey) return
    const { target, view: {document} } = evt
    const lineEl = document.querySelector('.cm-editor.cm-focused .cm-active.HyperMD-header')
    if (
      (target.classList.contains('cm-header') && !target.classList.contains('cm-formatting'))
    ) {
      const mEditor = new MarkdownEditor(app, createDiv())
      mEditor.align(lineEl)
      newPluginModal(app, mEditor).main(document)
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