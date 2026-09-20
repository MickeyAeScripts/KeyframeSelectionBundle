# KeyframeSelectionBundle 🔑

Four tiny After Effects scripts that **select keyframes by time** — after the playhead, before it, on it, or inside the work area. Built to live on hotkeys.

## What's inside

| Script | Selects |
|---|---|
| `SelectFollowingKeyframes.jsx` | Every keyframe **after** the playhead |
| `SelectPreviousKeyframes.jsx` | Every keyframe **before** the playhead |
| `SelectKeysAtCurrentTime.jsx` | Every keyframe sitting **on** the playhead |
| `SelectKeysInWorkArea.jsx` | Every keyframe **inside the work area** |

```
                    playhead
                       │
  Position   ◆    ◆    ◆    ◆    ◆
  Opacity              ◆  ◆
  Blurriness      ◆         ◆
             └─ previous ─┘│└─ following ─┘
                        current
```

All four work the same way:

- **Selected layers, or all of them** — with layers selected they only touch those; with nothing selected they run on the whole comp.
- **Every property, not just transforms** — effects, masks, shape contents, text animators and Puppet pins are all walked. Separated X/Y/Z position is handled.
- **Clean selection** — keys that don't match are deselected, so you get exactly the set you asked for (see `ADD_TO_SELECTION` to change that).
- **One undo step**, no dialogs.

Great for: sliding the rest of an animation later to make room, deleting everything after a cut, easing every key on a beat at once (**F9**), or copying just the keys inside the work area.

## Installation

### As Regular Scripts
- Place the `.jsx` files in your **Scripts** folder and run via **File → Scripts**:
  ```
  Windows: C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\
  macOS:   /Applications/Adobe After Effects [version]/Scripts/
  ```

### As Hotkeys (recommended)
- Keep the `.jsx` files anywhere and trigger them from your hotkey tool of choice, e.g. AutoHotkey:
  ```ahk
  run, "<path-to-AfterFX.exe>" -r "C:\path\to\SelectFollowingKeyframes.jsx"
  ```

## Usage

1. **Open a composition.** Optionally select the layers you care about.
2. **Move the playhead** (or set the work area).
3. **Run the script.** The matching keyframes are selected — move, ease, copy or delete them.

## Options

All four files are the same script with a different `MODE`. The config block at the top:

| Option | Default | What it does |
|---|---|---|
| `MODE` | per file | `"following"`, `"previous"`, `"current"` or `"workarea"` |
| `INCLUDE_PLAYHEAD` | `false` | Following / Previous: also take a key sitting exactly on the playhead |
| `ADD_TO_SELECTION` | `false` | `true` = keep already-selected keys and add to them |
| `SKIP_LOCKED` | `true` | Leave locked layers alone |

## Notes

- "On the playhead" means within a quarter of a frame, so sub-frame drift doesn't matter.
- The work area range is inclusive at both ends.
- Nothing happens if no composition is active.

## Requirements

- Adobe After Effects (tested on 2026 / 26.3)

## Credits

The *at current time* and *in work area* ideas are long-time favourites from [Zack Lovatt's zl_Scriptlets](https://github.com/zlovatt/zl_Scriptlets) — go grab his collection, it's great. The scripts here are an independent implementation.

## License

MIT
