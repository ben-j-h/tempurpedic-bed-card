# Tempurpedic Bed Card

Custom Lovelace card for the [ha-tempurpedic](https://github.com/ben-j-h/ha-tempurpedic) integration.

Inspired by the TEMPUR-PEDIC Ergo app — dark navy theme, hold-to-move controls, per-zone vibration sliders.

## Features

- **LIFT view** — Hold HEAD ▲▼ and LEG ▲▼ buttons; commands repeat every 250ms while held (matches app behavior). Memory presets 1–4. FLAT button.
- **MASSAGE view** — Per-zone intensity (+/−) for Head, Lumbar, and Leg. Four vibration mode presets. STOP button.
- **Split king support** — LEFT / BOTH / RIGHT toggle at top sends commands to one or both sides simultaneously.

## Installation

### HACS (recommended)

1. HACS → Frontend → ⋮ → Custom repositories → add this repo → category: **Lovelace**
2. Install **Tempurpedic Bed Card**
3. Hard refresh the browser

### Manual

Copy `dist/tempurpedic-bed-card.js` to `config/www/` and add a Lovelace resource:
```yaml
url: /local/tempurpedic-bed-card.js
type: module
```

## Configuration

```yaml
type: custom:tempurpedic-bed-card
left_prefix: ha_tempurpedic_left_side    # entity slug prefix for left side
right_prefix: ha_tempurpedic_right_side  # entity slug prefix for right side
default_side: both                        # left | right | both
```

### Finding your prefix

In HA go to **Settings → Devices & Services → ha_tempurpedic** and look at any entity. The prefix is everything before the last `_word`. For example if the entity is `button.tempurpedic_192_168_1_233_flat`, the prefix is `tempurpedic_192_168_1_233`.

For a single bed (not split king), just set one prefix:

```yaml
type: custom:tempurpedic-bed-card
left_prefix: tempurpedic_192_168_1_233
```

## Required entities

The card expects these entities to exist (per prefix):

| Entity | Purpose |
|---|---|
| `button.{prefix}_flat` | Move to flat |
| `button.{prefix}_head_up` | Head up (hold) |
| `button.{prefix}_head_down` | Head down (hold) |
| `button.{prefix}_legs_up` | Legs up (hold) |
| `button.{prefix}_legs_down` | Legs down (hold) |
| `button.{prefix}_preset_1..4` | Memory presets |
| `button.{prefix}_vibrate_off` | Stop vibration |
| `button.{prefix}_vibrate_1..4` | Vibration presets |
| `number.{prefix}_vib_head` | Head vibration intensity 1–10 |
| `number.{prefix}_vib_torso` | Lumbar vibration intensity 1–10 |
| `number.{prefix}_vib_legs` | Leg vibration intensity 1–10 |
