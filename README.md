# Tempurpedic Bed Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

A touch-optimized Lovelace card for the [ha-tempurpedic](https://github.com/ben-j-h/ha-tempurpedic) integration. Matches the feel of the TEMPUR-Pedic Ergo app — hold-to-move position controls, per-zone vibration sliders, and full split-king support.

![icon](icon.png)

**Requires ha-tempurpedic v1.0.1 or newer.**

## Features

- **POSITION tab** — Hold HEAD ▲▼ and LEG ▲▼ to move; the integration loops commands server-side so there's no jitter. Memory presets 1–4. FLAT button always visible.
- **MASSAGE tab** — Smooth range sliders for Head, Lumbar, and Leg vibration intensity (1–10). Four presets plus an OFF button directly in the row.
- **Split-king toggle** — LEFT / BOTH / RIGHT selector sends commands to one or both sides simultaneously.
- **HA theme-aware** — Uses CSS variables (`--ha-card-background`, `--primary-color`, etc.) so the card matches whatever theme you have active.
- **Bed silhouette** — Static profile illustration on the position tab for spatial orientation. Will animate once tilt sensors are added.

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

```yaml
type: custom:tempurpedic-bed-card
left_prefix: master_bedroom_left    # entity slug prefix for left side
right_prefix: master_bedroom_right  # entity slug prefix for right side
default_side: both                  # left | right | both
```

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
| `button.{prefix}_preset_1` … `preset_4` | Memory presets |
| `button.{prefix}_vibrate_off` | Stop vibration |
| `button.{prefix}_vibrate_1` … `vibrate_4` | Vibration presets |
| `number.{prefix}_vib_head` | Head vibration intensity 1–10 |
| `number.{prefix}_vib_torso` | Lumbar vibration intensity 1–10 |
| `number.{prefix}_vib_legs` | Leg vibration intensity 1–10 |

---

[releases-shield]: https://img.shields.io/github/v/release/ben-j-h/tempurpedic-bed-card?style=for-the-badge
[releases]: https://github.com/ben-j-h/tempurpedic-bed-card/releases
[license-shield]: https://img.shields.io/github/license/ben-j-h/tempurpedic-bed-card?style=for-the-badge
