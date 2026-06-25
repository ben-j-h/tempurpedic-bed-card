/**
 * tempurpedic-bed-card
 * Custom Lovelace card for TEMPUR-Ergo adjustable base (ha_tempurpedic integration).
 *
 * Configuration:
 *   type: custom:tempurpedic-bed-card
 *   left_prefix: "ha_tempurpedic_left_side"   # entity slug prefix for left side
 *   right_prefix: "ha_tempurpedic_right_side"  # entity slug prefix for right side
 *   default_side: "both"                        # left | right | both
 *
 * Entity IDs are constructed as:
 *   button.{prefix}_flat, button.{prefix}_head_up, button.{prefix}_head_down,
 *   button.{prefix}_legs_up, button.{prefix}_legs_down,
 *   button.{prefix}_preset_1..4,
 *   button.{prefix}_vibrate_off, button.{prefix}_vibrate_1..4,
 *   number.{prefix}_vib_head, number.{prefix}_vib_torso, number.{prefix}_vib_legs
 */


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

  /* massage wave icons */
  .wave-icon { font-size: 16px; }
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
    this._vibValues = { head: 1, torso: 1, legs: 1 };
  }

  setConfig(config) {
    if (!config.left_prefix && !config.right_prefix) {
      throw new Error('tempurpedic-bed-card: set left_prefix and/or right_prefix');
    }
    this._config = config;
    this._side = config.default_side || 'both';
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Sync vib number entities into local state
    ['head', 'torso', 'legs'].forEach(zone => {
      const prefix = this._activePrefixes()[0];
      if (!prefix) return;
      const eid = `number.${prefix}_vib_${zone}`;
      const s = hass.states[eid];
      if (s) this._vibValues[zone] = parseFloat(s.state) || 1;
    });
    this._updateVibDisplays();
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
    const clamped = Math.max(1, Math.min(10, value));
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
      const el = this.shadowRoot.querySelector(`.vib-val-${zone}`);
      if (el) el.textContent = this._vibValues[zone];
    });
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
  }

  _buildHTML() {
    const cfg = this._config || {};
    const hasBoth = cfg.left_prefix && cfg.right_prefix;

    const sideToggle = hasBoth ? `
      <div class="side-toggle">
        <div class="side-btn ${this._side==='left'  ? 'active' : ''}" data-side="left">LEFT</div>
        <div class="side-btn ${this._side==='both'  ? 'active' : ''}" data-side="both">BOTH</div>
        <div class="side-btn ${this._side==='right' ? 'active' : ''}" data-side="right">RIGHT</div>
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
      <div class="controls-row">
        ${this._buildVibControl('head',  'HEAD')}
        ${this._buildVibControl('torso', 'LUMBAR')}
        ${this._buildVibControl('legs',  'LEG')}
      </div>
      <div class="section-label">MASSAGE MODE</div>
      <div class="round-row">
        <button class="round-btn" data-action="vibrate_1" title="Wave 1">〜</button>
        <button class="round-btn" data-action="vibrate_2" title="Wave 2">≈</button>
        <button class="round-btn" data-action="vibrate_3" title="Wave 3">≋</button>
        <button class="round-btn" data-action="vibrate_4" title="Pulse">▮▮</button>
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
      </div>
    `;
  }

  _buildVibControl(zone, label) {
    return `
      <div class="control-group">
        <div class="pill">
          <button class="pill-btn" data-vib-up="${zone}">+</button>
          <div class="vib-value vib-val-${zone}">${this._vibValues[zone]}</div>
          <button class="pill-btn" data-vib-down="${zone}">−</button>
        </div>
        <div class="control-label">${label}</div>
      </div>
    `;
  }

  _buildBottomBar() {
    const isLift    = this._view === 'lift';
    const isMassage = this._view === 'massage';
    const actionLabel = isMassage ? 'STOP' : 'FLAT';
    const actionKey   = isMassage ? 'vibrate_off' : 'flat';

    return `
      <div class="bottom-bar">
        <div class="nav-tabs">
          <button class="nav-tab ${isLift ? 'active' : ''}" data-view="lift" title="Lift">${ICON_LIFT}</button>
          <button class="nav-tab ${isMassage ? 'active' : ''}" data-view="massage" title="Massage">${ICON_MASSAGE}</button>
        </div>
        <button class="action-btn" data-action="${actionKey}">${actionLabel}</button>
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
        this._callButton(e.currentTarget.dataset.action);
        // Brief visual flash
        e.currentTarget.classList.add('active');
        setTimeout(() => e.currentTarget.classList.remove('active'), 300);
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

    // Vibration +/-
    card.querySelectorAll('[data-vib-up]').forEach(btn => {
      btn.addEventListener('click', () => {
        const zone = btn.dataset.vibUp;
        this._setVib(zone, this._vibValues[zone] + 1);
      });
    });
    card.querySelectorAll('[data-vib-down]').forEach(btn => {
      btn.addEventListener('click', () => {
        const zone = btn.dataset.vibDown;
        this._setVib(zone, this._vibValues[zone] - 1);
      });
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
    };
  }
}

customElements.define('tempurpedic-bed-card', TempurpedicBedCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'tempurpedic-bed-card',
  name: 'Tempurpedic Bed Card',
  description: 'Control panel for TEMPUR-Ergo adjustable base.',
  preview: true,
});
