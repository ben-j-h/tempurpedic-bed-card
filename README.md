# Tempurpedic Bed Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

A touch-optimized Lovelace card for the [ha-tempurpedic](https://github.com/ben-j-h/ha-tempurpedic) integration. Matches the feel of the TEMPUR-Pedic Ergo app — hold-to-move position controls, per-zone vibration sliders, and full split-king support.

![icon](icon.png)

**Requires ha-tempurpedic v1.1.0 or newer** (the version that replaced the
preset / vibrate buttons with the `massage_program` and `position_preset`
number entities).

## Features

- **POSITION tab** — Hold HEAD ▲▼ and LEG ▲▼ to move; the integration loops commands server-side so there's no jitter. Memory positions 1–4 (tap to recall; clears when you move the bed). FLAT button always visible.
- **MASSAGE tab** — Smooth range sliders for Head, Lumbar, and Leg vibration intensity (0–10). A MASSAGE PROGRAM row (1–4 built-in programs + OFF); adjusting a slider drops the program.
- **Split-king toggle** — LEFT / BOTH / RIGHT selector (labels configurable), plus per-user default side.
- **HA theme-aware** — Uses CSS variables (`--ha-card-background`, `--primary-color`, etc.) so the card matches whatever theme you have active.
- **Bed silhouette** — Profile illustration on the position tab, animated from the integration's position sensors.

## Installation

### HACS (recommended)

1. HACS → **Frontend** → ⋮ → **Custom repositories**
2. Add `https://github.com/ben-j-h/tempurpedic-bed-card` → category: **Lovelace**
3. Install **Tempurpedic Bed Card**
4. Restart Home Assistant, then hard-refresh the browser (Ctrl+Shift+R)

### Manual

Copy `dist/tempurpedic-bed-card.js` to `config/www/` and add a Lovelace resource:

```yaml
url: /local/tempurpedic-bed-card.js
type: module
```

## Configuration

The card has a **visual editor** — add it from the dashboard's card picker and
fill in the fields, or edit YAML directly:

```yaml
type: custom:tempurpedic-bed-card
left_prefix: master_bedroom_left    # entity slug prefix for left side
right_prefix: master_bedroom_right  # entity slug prefix for right side
default_side: both                  # left | right | both — fallback for everyone
user_sides:                         # optional — per-user starting side
  Ben: left
  Carrie: right
left_name: Ben                      # optional — label for the LEFT toggle
right_name: Carrie                  # optional — label for the RIGHT toggle
both_name: Both                     # optional — label for the BOTH toggle
```

| Option | Default | Purpose |
|---|---|---|
| `left_prefix` / `right_prefix` | — | entity slug prefix for each side (at least one required) |
| `default_side` | `both` | side selected on load for anyone not in `user_sides` |
| `user_sides` | — | map of HA user **name** (or user ID) → `left` / `right` / `both`; picks the starting side per logged-in user |
| `left_name` / `right_name` / `both_name` | `Left` / `Right` / `Both` | text on the side-toggle buttons (rendered uppercase) |

`user_sides` only sets which side is shown *first* — anyone can still tap the
LEFT / BOTH / RIGHT toggle. Matching is by the user's display name; a user ID
also works if names aren't unique.

### Finding your prefix

In HA go to **Settings → Devices & Services**, find your Tempurpedic device, and open any entity. The prefix is the entity ID with the last word removed.

For example, if your device is named **Master Bedroom Left**, the entity `button.master_bedroom_left_flat` has prefix `master_bedroom_left`.

For a single (non-split) bed, omit the unused side:

```yaml
type: custom:tempurpedic-bed-card
left_prefix: master_bedroom
default_side: left
```

## Required entities

The card expects these entities per prefix (all created automatically by ha-tempurpedic):

| Entity | Purpose |
|---|---|
| `button.{prefix}_flat` | Move to flat |
| `button.{prefix}_head_up` | Head up (hold) |
| `button.{prefix}_head_down` | Head down (hold) |
| `button.{prefix}_legs_up` | Legs up (hold) |
| `button.{prefix}_legs_down` | Legs down (hold) |
| `number.{prefix}_vib_head` | Head vibration intensity 0–10 |
| `number.{prefix}_vib_torso` | Lumbar vibration intensity 0–10 |
| `number.{prefix}_vib_legs` | Leg vibration intensity 0–10 |
| `number.{prefix}_massage_program` | 0 = off, 1–4 = built-in program |
| `number.{prefix}_position_preset` | 0 = none, 1–4 = recall memory position |
| `sensor.{prefix}_head_position` / `_leg_position` | drive the bed silhouette (optional) |

---

[releases-shield]: https://img.shields.io/github/v/release/ben-j-h/tempurpedic-bed-card?style=for-the-badge
[releases]: https://github.com/ben-j-h/tempurpedic-bed-card/releases
[license-shield]: https://img.shields.io/github/license/ben-j-h/tempurpedic-bed-card?style=for-the-badge
