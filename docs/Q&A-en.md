
## Enter Key Combinations

| Modifiers | Key   | will ...   |
| --------- | ----- | ---------- |
|           | Enter | submit     |
| ['Mod']   | Enter | submit     |
| ['Shift'] | Enter | split [^1] |

[^1]: When pressed in the middle of a heading, the content before the cursor will be submitted as a new heading, and the rest will move to the next line.

## About Feature Request

- Pressing Ctrl + Z to undo can also revert the internal links, bulk rename, etc: The plugin should ensure the safety of data processing using the official method. Since the current renaming command of Obsidian is implemented via a modal, requirements that fall outside the modal and involve separate replication of data processing won’t be added by this plugin.

- Triggering on cursor movement to a heading line: After the release, someone wrote a version [t86850#9](https://forum.obsidian.md/t/mini-plugin-update-internal-links-when-renaming-a-heading/86850/9). However some users reported that this method had other problems [t75847#7](https://forum.obsidian.md/t/always-run-rename-this-heading-command-when-a-heading-is-clicked/75847/7), so this plugin won’t add it.

- In terms of renaming headings, a plugin is always a workaround; a seamless experience still awaits official implementation. Before that, this plugin aims to remain simple and lightweight, to save space, optimize performance, and reduce conflicts.

## 20241017 - v 1.7.4

The built-in editing popover of the v 1.7.4 Core plugin Page Preview has not been well integrated with other functions of the software itself. Some behaviors are features of Obsidian and not caused by this plugin.

Try:

1. Trigger the popover for any page preview.
2. Right-click inside the popover to trigger the context menu. Click to select any item.
3. Observe that the popover closes automatically right away.

You can test this in the Sandbox Vault without any other plugins.

You can resolve these issues by using another plugin’s or your own preview editing view, just as you did when the core plugin didn’t support it.
