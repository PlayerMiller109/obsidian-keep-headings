# Keep Headings

中文介绍见 [Obsidian Chinese Forum t38592](https://forum-zh.obsidian.md/t/topic/38592/1)

Keep Headings is an Obsidian community plugin and a pure JS project. It can update internal links, such as `[[MD#Test]]`, when renaming a heading `Test` within the note `MD.md`.

When clicking on a heading or heading line, it will trigger a relatively more seamless modal for renaming, and will auto submit when clicking outside or pressing Ctrl + Enter. Press Esc to cancel.

<p>
<img width="260" src="https://github.com/user-attachments/assets/fd7d8b26-0a77-45eb-9f21-add14acbf0bb">
<img width="260" src="https://github.com/user-attachments/assets/8b39782a-bfde-49d2-9218-27b61e52f1a0">
<img width="260" src="https://github.com/user-attachments/assets/f0ec84f5-9a70-4f3d-be29-bc2a4841fd4a">
</p>

- Won’t trigger on right click or click with Ctrl or Alt key. For management.
- Data processing fully relies on official “Rename this heading” command. Safe.
- If you accidentally submit an empty heading, though there will be a default “Update link” notice, don't worry as no actual changes will be made.

For the first time to take effect, please switch to another note or restart the software once.

## About Feature Request

<details><summary>Chinese version 中文版本，点击展开</summary><br>

- 希望按 Ctrl + Z 也可以撤销对应内部链接的重命名、希望批量重命名小标题等：软件目前提供的重命名小标题命令使用弹窗，插件需要使用官方方法以确保安全的数据处理。因此，脱离弹窗、需要独立复刻数据处理的需求，本插件不会添加。

- 改为光标移动到标题行触发：插件发布后，英文论坛有人写了一版 [t86850#9](https://forum.obsidian.md/t/mini-plugin-update-internal-links-when-renaming-a-heading/86850/9)，但有用户反映这种方式有其他问题 [t75847#7](https://forum.obsidian.md/t/always-run-rename-this-heading-command-when-a-heading-is-clicked/75847/7)，因而本插件不会添加该方式。

- 改为悬停按钮触发：感兴趣可以跟进 [Copy Section #3](https://github.com/skztr/obsidian-plugin-section-copy/issues/3)。重命名小标题本身是一个容易漏掉的操作，如果仍需要刻意触发，漏掉的可能性依然很大。本插件相对更看重数据稳定，所以不会添加该方式。
    - 作者将类似的需求总结为希望减少触发区域的改动。如此，将触发方式改为只点击标题、而不包括标题所在行，可能会略有好转。但是，单击标题所在行也可以触发原本就是其他用户提出的要求，不可兼得，也就不做过多改变了。

- 在重命名小标题这方面，插件始终只是变通方式，无感的体验仍需等待官方实现。在那之前，本插件期望保持简洁轻巧，以节省空间、优化性能、减少冲突。

<br></details>

- Hope pressing Ctrl + Z to undo can also revert the internal links, bulk rename, etc: Since the current renaming command of Obsidian is implemented via the modal, the plugin should ensure the safety of data processing using the official method. Thus, requirements that fall outside the modal and involve separate replication of data processing won’t be added by this plugin.

- Changed to trigger when the cursor moves to a heading line: After the release, someone wrote a version [t86850#9](https://forum.obsidian.md/t/mini-plugin-update-internal-links-when-renaming-a-heading/86850/9). However some users reported that this method had other problems [t75847#7](https://forum.obsidian.md/t/always-run-rename-this-heading-command-when-a-heading-is-clicked/75847/7), so this plugin won’t add it.

- Changed to trigger with a hover button: If interested, you can follow [Copy Section #3](https://github.com/skztr/obsidian-plugin-section-copy/issues/3). Renaming a heading is an easy-to-miss operation. If it still needs to be deliberately triggered, it’s likely to end up missing it. This plugin cares relatively more about data stability, so won’t add it.
    - The author summarized similar requirements as a desire to reduce the trigger area. In that case, changing to only click on a heading, not with the heading line, may be slightly better. However, triggering by clicking on the line was also a request put forward by other users. Since it’s impossible to have both, then just leave it.

- In terms of renaming headings, a plugin is always a workaround; a seamless experience still awaits official implementation. Before that, this plugin aims to remain simple and lightweight, to save space, optimize performance, and reduce conflicts.
