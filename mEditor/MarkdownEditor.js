const getEditMode = (app)=> {
  const _m = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
  _m.load(); _m.editable = !0; _m.showEditor()
  const EditMode = Object.getPrototypeOf(Object.getPrototypeOf(_m.editMode)).constructor
  _m.unload()
  return EditMode
}
// refer Quorafind/Obsidian-Task-Genius
module.exports = ({ob, EditorView})=> class {
  constructor(app, container) {
    this.scope = new ob.Scope(app.scope)

    const self = this
    const EditMode = getEditMode(app)
    const _old1 = EditMode.prototype.buildLocalExtensions
    EditMode.prototype.buildLocalExtensions = function () {
      const extensions = _old1.call(this)
      if (this === self.eMode) {
        extensions.push(
          EditorView.domEventHandlers({
            blur: ()=> {
              app.keymap.popScope(self.scope)
            },
            focusin: ()=> {
              app.keymap.pushScope(self.scope)
              app.workspace.activeEditor = self.owner
            },
          })
        )
      }
      return extensions
    }

    this.eMode = new EditMode(app, container, {
      app,
      getMode: ()=> 'source',
      onMarkdownScroll: ()=> {},
      syncScroll: ()=> {},
    })

    if (this.owner) {
      this.owner.editMode = this
      this.owner.editor = this.editor
    }
  }

  get app() { return this.eMode.app }
  get _loaded() { return this.eMode._loaded }
  get owner() { return this.eMode.owner }
  get editor() { return this.eMode.editor }
  get activeCM() { return this.eMode.activeCM }
  get value() { return this.activeCM?.state.doc.toString() || '' }
  get editorEl() { return this.eMode.editorEl }
  get containerEl() { return this.eMode.containerEl }
  set(content, force = !1) { this.eMode.set(content, force) }

  setup = (data, offset)=> {
    this.set(data)
    this.eMode.focus()
    this.editor.setCursor(0, offset)
  }
  align = (lineEl)=> {
    const rect = lineEl.getBoundingClientRect()
    this.containerEl.setCssProps({
      position: 'absolute',
      left: `${rect.left}px`, width: `${rect.width}px`,
      top: `${rect.top}px`, height: `${rect.height}px`,
      background: 'var(--background-secondary)',
    })
  }

  register(cb) { this.eMode.register(cb) }
  destroy() {
    if (this._loaded && typeof this.eMode.unload === 'function') {
      this.eMode.unload()
    }
    this.app.keymap.popScope(this.scope)
    this.app.workspace.activeEditor = null
    this.containerEl.empty()
    this.eMode.destroy()
  }
  onunload() {
    if (typeof this.eMode.onunload === 'function') {
      this.eMode.onunload()
    }
    this.destroy()
  }
  unload() {
    if (typeof this.eMode.unload === 'function') {
      this.eMode.unload()
    }
  }
}