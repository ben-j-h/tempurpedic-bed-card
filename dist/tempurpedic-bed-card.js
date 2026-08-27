/**
 * tempurpedic-bed-card
 * Custom Lovelace card for TEMPUR-Ergo adjustable base (ha_tempurpedic integration).
 *
 * Configuration:
 *   type: custom:tempurpedic-bed-card
 *   left_prefix: "ha_tempurpedic_left_side"   # entity slug prefix for left side
 *   right_prefix: "ha_tempurpedic_right_side"  # entity slug prefix for right side
 *   default_side: "both"                        # left | right | both
 *   left_name: "Left"                           # optional label for the left toggle
 *   right_name: "Right"                         # optional label for the right toggle
 *   both_name: "Both"                           # optional label for the both toggle
 *
 * Entity IDs are constructed as:
 *   button.{prefix}_flat, button.{prefix}_head_up, button.{prefix}_head_down,
 *   button.{prefix}_legs_up, button.{prefix}_legs_down,
 *   button.{prefix}_preset_1..4,
 *   button.{prefix}_vibrate_off, button.{prefix}_vibrate_1..4,
 *   number.{prefix}_vib_head, number.{prefix}_vib_torso, number.{prefix}_vib_legs
 */

const CARD_VERSION = '1.4.0';

console.info(
  `%c TEMPURPEDIC-BED-CARD %c v${CARD_VERSION} `,
  'color:#fff;background:#03a9f4;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px',
  'color:#03a9f4;background:#1c1c1c;border-radius:0 3px 3px 0;padding:2px 4px',
);


const STYLES = `
  :host {
    display: block;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .card {
    background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
    border-radius: 16px;
    overflow: hidden;
    color: var(--primary-text-color, #e8f4ff);
    user-select: none;
    -webkit-user-select: none;
    border: 1px solid var(--divider-color, rgba(255,255,255,0.06));
  }

  /* ── header ── */
  .header {
    text-align: center;
    padding: 18px 16px 4px;
  }
  .brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--secondary-text-color, rgba(255,255,255,0.5));
    text-transform: uppercase;
  }
  .view-title {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-top: 4px;
    color: var(--primary-text-color, #e8f4ff);
  }

  /* ── side toggle ── */
  .side-toggle {
    display: flex;
    justify-content: center;
    gap: 0;
    margin: 10px auto 0;
    background: var(--secondary-background-color, rgba(255,255,255,0.07));
    border-radius: 20px;
    width: fit-content;
    padding: 3px;
  }
  .side-btn {
    padding: 5px 18px;
    border-radius: 17px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.5));
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .side-btn.active {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  /* ── controls row ── */
  .controls-row {
    display: flex;
    justify-content: center;
    gap: 28px;
    padding: 28px 16px 18px;
  }
  .control-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .control-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.5));
    margin-top: 4px;
  }

  /* ── pill button ── */
  .pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 68px;
    background: var(--secondary-background-color, rgba(255,255,255,0.07));
    border-radius: 34px;
    padding: 6px;
    gap: 4px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
  }

  .pill-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15);
    transition: filter 0.1s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
  }
  .pill-btn:active, .pill-btn.pressed {
    filter: brightness(0.8);
    transform: scale(0.94);
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  /* vibration +/- value display */
  .vib-value {
    width: 52px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color, #03a9f4);
  }

  /* ── section label ── */
  .section-label {
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--secondary-text-color, rgba(255,255,255,0.5));
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  /* ── round buttons (presets / modes) ── */
  .round-row {
    display: flex;
    justify-content: center;
    gap: 14px;
    padding: 0 16px 24px;
  }
  .round-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: var(--secondary-background-color, rgba(255,255,255,0.07));
    color: var(--primary-text-color, #e8f4ff);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: background 0.15s, color 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .round-btn:active, .round-btn.active {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    transform: scale(0.94);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }

  /* ── bottom bar ── */
  .bottom-bar {
    display: flex;
    align-items: center;
    padding: 8px 16px 14px;
    border-top: 1px solid var(--divider-color, rgba(255,255,255,0.07));
  }
  .nav-tabs {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .nav-tab {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--secondary-text-color, rgba(255,255,255,0.4));
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-tab.active {
    color: var(--primary-color, #03a9f4);
  }
  .nav-tab svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  .action-btn {
    padding: 8px 22px;
    border-radius: 20px;
    border: none;
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: filter 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .action-btn:active {
    filter: brightness(0.8);
  }

  /* ── bed silhouette ── */
  .bed-silhouette {
    padding: 10px 20px 0;
    opacity: 0.6;
  }
  .bed-silhouette svg { width: 100%; height: auto; display: block; }
  .bed-head-group {
    transform-box: fill-box;
    transform-origin: 100% 100%;
    transition: transform 0.15s ease-out;
  }
  .bed-leg-group {
    transform-box: fill-box;
    transform-origin: 0% 100%;
    transition: transform 0.15s ease-out;
  }

  /* ── hold hint ── */
  .hold-hint {
    font-size: 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.3));
    margin-top: -2px;
  }

  /* ── vibration sliders ── */
  .vib-slider-group {
    padding: 16px 24px 8px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .vib-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .vib-zone-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.5));
    width: 46px;
    flex-shrink: 0;
  }
  .vib-slider {
    flex: 1;
    height: 4px;
    appearance: none;
    -webkit-appearance: none;
    background: var(--secondary-background-color, rgba(255,255,255,0.12));
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .vib-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    cursor: pointer;
  }
  .vib-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    cursor: pointer;
    border: none;
  }
  .vib-slider-val {
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-color, #03a9f4);
    width: 22px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── off button in massage row ── */
  .off-btn {
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--secondary-text-color, rgba(255,255,255,0.45));
    background: rgba(255,255,255,0.04);
  }
  .off-btn:active {
    background: var(--error-color, #f44336) !important;
    color: #fff !important;
    box-shadow: 0 2px 6px rgba(200,0,0,0.4) !important;
  }

  /* ── updated nav tabs with labels ── */
  .nav-tab {
    width: auto !important;
    height: auto !important;
    padding: 6px 16px !important;
    border-radius: 12px !important;
    flex-direction: column !important;
    gap: 2px;
  }
  .nav-label {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;

// SVG icons for bottom nav
const ICON_LIFT = `<svg viewBox="0 0 24 24"><path d="M12 4l-6 6h4v4h4v-4h4l-6-6zm-6 12v2h12v-2H6z"/></svg>`;
const ICON_MASSAGE = `<svg viewBox="0 0 24 24"><path d="M3 8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2c0 3.87-3.13 7-7 7h-4C6.13 17 3 13.87 3 10V8zm2 0v2c0 2.76 2.24 5 5 5h4c2.76 0 5-2.24 5-5V8H5zm7 9v2H8v-2h4z"/></svg>`;

class TempurpedicBedCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._view = 'lift';       // 'lift' | 'massage'
    this._side = 'both';       // 'left' | 'right' | 'both'
    this._vibValues = { head: 0, torso: 0, legs: 0 };
  }

  setConfig(config) {
    if (!config.left_prefix && !config.right_prefix) {
      throw new Error('tempurpedic-bed-card: set left_prefix and/or right_prefix');
    }
    this._config = config;
    this._sideResolved = false;
    this._side = this._resolveDefaultSide();
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // hass arrives after setConfig, so this is the first chance to see who is
    // logged in. Apply the per-user default once, without stomping later toggles.
    if (!this._sideResolved && hass && hass.user) {
      this._sideResolved = true;
      const resolved = this._resolveDefaultSide();
      if (resolved !== this._side) {
        this._side = resolved;
        this._render();
        return;
      }
    }
    this._updateSilhouette();
  }

  _resolveDefaultSide() {
    const c = this._config || {};
    let side = c.default_side || 'both';
    const user = this._hass && this._hass.user;
    const map = c.user_sides || {};
    if (user) {
      for (const [who, s] of Object.entries(map)) {
        if (who === user.name || who === user.id) { side = s; break; }
      }
    }
    // Don't land on a side that has no prefix configured.
    if (side === 'left'  && !c.left_prefix)  side = c.right_prefix ? 'right' : 'both';
    if (side === 'right' && !c.right_prefix) side = c.left_prefix  ? 'left'  : 'both';
    return side;
  }

  _escape(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  _activePrefixes() {
    const c = this._config || {};
    const prefixes = [];
    if (this._side === 'left'  || this._side === 'both') if (c.left_prefix)  prefixes.push(c.left_prefix);
    if (this._side === 'right' || this._side === 'both') if (c.right_prefix) prefixes.push(c.right_prefix);
    return prefixes;
  }

  _callButton(key) {
    if (!this._hass) return;
    this._activePrefixes().forEach(prefix => {
      const eid = `button.${prefix}_${key}`;
      if (this._hass.states[eid]) {
        this._hass.callService('button', 'press', { entity_id: eid });
      }
    });
  }

  _setVib(zone, value) {
    if (!this._hass) return;
    const clamped = Math.max(0, Math.min(10, value));
    this._vibValues[zone] = clamped;
    this._activePrefixes().forEach(prefix => {
      const eid = `number.${prefix}_vib_${zone}`;
      if (this._hass.states[eid]) {
        this._hass.callService('number', 'set_value', { entity_id: eid, value: clamped });
      }
    });
    this._updateVibDisplays();
  }

  _startHold(key) {
    if (!this._hass) return;
    this._activePrefixes().forEach(prefix => {
      const eid = `button.${prefix}_${key}`;
      if (this._hass.states[eid]) {
        this._hass.callService('ha_tempurpedic', 'start_move', { entity_id: eid });
      }
    });
  }

  _stopHold() {
    if (!this._hass) return;
    this._hass.callService('ha_tempurpedic', 'stop_move', {});
  }

  _updateVibDisplays() {
    if (!this.shadowRoot) return;
    ['head', 'torso', 'legs'].forEach(zone => {
      const val = this.shadowRoot.querySelector(`.vib-val-${zone}`);
      if (val) val.textContent = this._vibValues[zone];
      const slider = this.shadowRoot.querySelector(`[data-vib-zone="${zone}"]`);
      if (slider) slider.value = this._vibValues[zone];
    });
  }

  _updateSilhouette() {
    if (!this.shadowRoot || !this._hass) return;
    const prefix = this._activePrefixes()[0];
    const headPct = prefix
      ? (parseFloat(this._hass.states[`sensor.${prefix}_head_position`]?.state) || 0)
      : 0;
    const legPct = prefix
      ? (parseFloat(this._hass.states[`sensor.${prefix}_leg_position`]?.state) || 0)
      : 0;
    const headGroup = this.shadowRoot.querySelector('.bed-head-group');
    const legGroup  = this.shadowRoot.querySelector('.bed-leg-group');
    if (headGroup) headGroup.style.transform = `rotate(${(headPct / 100) * 40}deg)`;
    if (legGroup)  legGroup.style.transform  = `rotate(${-(legPct / 100) * 25}deg)`;
  }

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.appendChild(style);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = this._buildHTML();
    shadow.appendChild(card);

    this._attachEvents(card);
    this._updateSilhouette();
  }

  _buildHTML() {
    const cfg = this._config || {};
    const hasBoth = cfg.left_prefix && cfg.right_prefix;

    const leftLabel  = this._escape(cfg.left_name  || 'Left');
    const rightLabel = this._escape(cfg.right_name || 'Right');
    const bothLabel  = this._escape(cfg.both_name  || 'Both');

    const sideToggle = hasBoth ? `
      <div class="side-toggle">
        <div class="side-btn ${this._side==='left'  ? 'active' : ''}" data-side="left">${leftLabel}</div>
        <div class="side-btn ${this._side==='both'  ? 'active' : ''}" data-side="both">${bothLabel}</div>
        <div class="side-btn ${this._side==='right' ? 'active' : ''}" data-side="right">${rightLabel}</div>
      </div>` : '';

    return `
      <div class="header">
        <div class="brand">✦ TEMPUR-PEDIC</div>
        <div class="view-title">${this._view === 'lift' ? 'LIFT' : 'MASSAGE'}</div>
        ${sideToggle}
      </div>
      ${this._view === 'lift' ? this._buildLiftHTML() : this._buildMassageHTML()}
      ${this._buildBottomBar()}
    `;
  }

  _buildLiftHTML() {
    return `
      <div class="bed-silhouette">
        <svg viewBox="0 0 260 106" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="90" width="244" height="8" rx="4" fill="rgba(255,255,255,0.08)"/>
          <line x1="119" y1="80" x2="119" y2="90" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
          <g class="bed-head-group">
            <rect x="8" y="80" width="110" height="10" fill="rgba(255,255,255,0.12)"/>
            <rect x="12" y="68" width="38" height="10" rx="5" fill="rgba(255,255,255,0.20)"/>
          </g>
          <g class="bed-leg-group">
            <rect x="120" y="80" width="132" height="10" fill="rgba(255,255,255,0.12)"/>
          </g>
          <text x="63" y="103" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.35)" font-family="sans-serif" letter-spacing="1.5" font-weight="600">HEAD</text>
          <text x="186" y="103" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.35)" font-family="sans-serif" letter-spacing="1.5" font-weight="600">LEG</text>
        </svg>
      </div>
      <div class="controls-row">
        ${this._buildPillControl('head_up', 'head_down', 'HEAD')}
        ${this._buildPillControl('legs_up', 'legs_down', 'LEG')}
      </div>
      <div class="section-label">MEMORY POSITION</div>
      <div class="round-row">
        <button class="round-btn" data-action="preset_1">1</button>
        <button class="round-btn" data-action="preset_2">2</button>
        <button class="round-btn" data-action="preset_3">3</button>
        <button class="round-btn" data-action="preset_4">4</button>
      </div>
    `;
  }

  _buildMassageHTML() {
    return `
      <div class="vib-slider-group">
        <div class="vib-slider-row">
          <span class="vib-zone-label">HEAD</span>
          <input type="range" class="vib-slider" min="0" max="10" step="1"
            value="${this._vibValues.head}" data-vib-zone="head">
          <span class="vib-slider-val vib-val-head">${this._vibValues.head}</span>
        </div>
        <div class="vib-slider-row">
          <span class="vib-zone-label">LUMBAR</span>
          <input type="range" class="vib-slider" min="0" max="10" step="1"
            value="${this._vibValues.torso}" data-vib-zone="torso">
          <span class="vib-slider-val vib-val-torso">${this._vibValues.torso}</span>
        </div>
        <div class="vib-slider-row">
          <span class="vib-zone-label">LEG</span>
          <input type="range" class="vib-slider" min="0" max="10" step="1"
            value="${this._vibValues.legs}" data-vib-zone="legs">
          <span class="vib-slider-val vib-val-legs">${this._vibValues.legs}</span>
        </div>
      </div>
      <div class="section-label">MASSAGE PRESET</div>
      <div class="round-row">
        <button class="round-btn" data-action="vibrate_1">1</button>
        <button class="round-btn" data-action="vibrate_2">2</button>
        <button class="round-btn" data-action="vibrate_3">3</button>
        <button class="round-btn" data-action="vibrate_4">4</button>
        <button class="round-btn off-btn" data-action="vibrate_off">OFF</button>
      </div>
    `;
  }

  _buildPillControl(upKey, downKey, label) {
    return `
      <div class="control-group">
        <div class="pill">
          <button class="pill-btn" data-hold="${upKey}">▲</button>
          <button class="pill-btn" data-hold="${downKey}">▼</button>
        </div>
        <div class="control-label">${label}</div>
        <div class="hold-hint">hold to move</div>
      </div>
    `;
  }

_buildBottomBar() {
    const isLift    = this._view === 'lift';
    const isMassage = this._view === 'massage';
    return `
      <div class="bottom-bar">
        <div class="nav-tabs">
          <button class="nav-tab ${isLift ? 'active' : ''}" data-view="lift">
            ${ICON_LIFT}<span class="nav-label">POSITION</span>
          </button>
          <button class="nav-tab ${isMassage ? 'active' : ''}" data-view="massage">
            ${ICON_MASSAGE}<span class="nav-label">MASSAGE</span>
          </button>
        </div>
        <button class="action-btn" data-action="flat">FLAT</button>
      </div>
    `;
  }

  _attachEvents(card) {
    // Side toggle
    card.querySelectorAll('[data-side]').forEach(el => {
      el.addEventListener('click', e => {
        this._side = e.currentTarget.dataset.side;
        this._render();
      });
    });

    // Tab nav
    card.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        this._view = e.currentTarget.dataset.view;
        this._render();
      });
    });

    // Instant action buttons (presets, vib modes, flat, stop)
    card.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', e => {
        const action = e.currentTarget.dataset.action;
        if (action === 'vibrate_off') {
          ['head', 'torso', 'legs'].forEach(zone => this._setVib(zone, 0));
        } else {
          this._callButton(action);
        }
        // Brief visual flash (capture element — currentTarget is null inside setTimeout)
        const btn = e.currentTarget;
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 300);
      });
    });

    // Hold-to-move: head/leg up/down
    card.querySelectorAll('[data-hold]').forEach(btn => {
      const key = btn.dataset.hold;
      const onDown = () => { btn.classList.add('pressed'); this._startHold(key); };
      const onUp   = () => { btn.classList.remove('pressed'); this._stopHold(); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.setPointerCapture(e.pointerId); onDown(); });
      btn.addEventListener('pointerup',   onUp);
      btn.addEventListener('pointercancel', onUp);
    });

    // Vibration sliders
    card.querySelectorAll('[data-vib-zone]').forEach(slider => {
      slider.addEventListener('input', e => {
        this._setVib(e.currentTarget.dataset.vibZone, parseInt(e.currentTarget.value, 10));
      });
      slider.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
    });
  }

  getCardSize() { return 5; }

  static getConfigElement() {
    return document.createElement('tempurpedic-bed-card-editor');
  }

  static getStubConfig() {
    return {
      left_prefix:  'ha_tempurpedic_left_side',
      right_prefix: 'ha_tempurpedic_right_side',
      default_side: 'both',
      left_name:  'Left',
      right_name: 'Right',
    };
  }
}

customElements.define('tempurpedic-bed-card', TempurpedicBedCard);


/* ────────────────────────────────────────────────────────────────────────────
 * Visual editor
 * Rendered with <ha-form> (provided by the HA frontend) so it needs no build
 * step and matches the native look. Editing any field emits `config-changed`.
 * ──────────────────────────────────────────────────────────────────────────── */

const EDITOR_SCHEMA = [
  {
    name: '',
    type: 'grid',
    schema: [
      { name: 'left_prefix',  selector: { text: {} } },
      { name: 'right_prefix', selector: { text: {} } },
    ],
  },
  {
    name: 'default_side',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'left',  label: 'Left' },
          { value: 'both',  label: 'Both' },
          { value: 'right', label: 'Right' },
        ],
      },
    },
  },
  { name: 'user_sides', selector: { object: {} } },
  {
    name: '',
    type: 'grid',
    schema: [
      { name: 'left_name',  selector: { text: {} } },
      { name: 'right_name', selector: { text: {} } },
      { name: 'both_name',  selector: { text: {} } },
    ],
  },
];

const EDITOR_LABELS = {
  left_prefix:  'Left entity prefix',
  right_prefix: 'Right entity prefix',
  default_side: 'Default side',
  user_sides:   'Per-user default side',
  left_name:  'Left label',
  right_name: 'Right label',
  both_name:  'Both label',
};

const EDITOR_HELPERS = {
  left_prefix:  'e.g. master_bedroom_left — the entity ID up to the last word',
  right_prefix: 'Leave blank for a single (non-split) bed',
  default_side: 'Side selected when the card loads for everyone not listed below',
  user_sides:   'Map of HA user name (or user ID) to left / right / both — e.g. "Ben: left". Overrides the default above for that person.',
  left_name:  'Text on the LEFT toggle (shown uppercase). Default: Left',
  right_name: 'Text on the RIGHT toggle (shown uppercase). Default: Right',
  both_name:  'Text on the BOTH toggle (shown uppercase). Default: Both',
};

class TempurpedicBedCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
      this._form.computeHelper = (s) => EDITOR_HELPERS[s.name] || '';
      this._form.addEventListener('value-changed', (e) => {
        e.stopPropagation();
        const next = { type: this._config.type || 'custom:tempurpedic-bed-card' };
        for (const [k, v] of Object.entries(e.detail.value)) {
          if (v === '' || v === null || v === undefined) continue;
          if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
          next[k] = v;
        }
        this._config = next;
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: next },
          bubbles: true,
          composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = EDITOR_SCHEMA;
    this._form.data = this._config;
  }
}

customElements.define('tempurpedic-bed-card-editor', TempurpedicBedCardEditor);


window.customCards = window.customCards || [];
window.customCards.push({
  type: 'tempurpedic-bed-card',
  name: 'Tempurpedic Bed Card',
  description: 'Control panel for TEMPUR-Ergo adjustable base.',
  documentationURL: 'https://github.com/ben-j-h/tempurpedic-bed-card',
  preview: true,
});
