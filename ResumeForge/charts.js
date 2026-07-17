/**
 * ResumeForge — Custom Canvas Chart Library
 * Lightweight, dependency-free chart components
 */

/* ─────────────────────────────────────────
   UTILITY: Easing functions
───────────────────────────────────────── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* ─────────────────────────────────────────
   1. ANIMATED DONUT CHART (ATS Score)
───────────────────────────────────────── */
class DonutChart {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.score     = options.score     || 0;
    this.maxScore  = options.maxScore  || 100;
    this.lineWidth = options.lineWidth || 18;
    this.duration  = options.duration  || 1600;

    this.colorStart = options.colorStart || '#78350F';
    this.colorEnd   = options.colorEnd   || '#D97706';
    this.trackColor = options.trackColor || null; // auto

    // DPR scaling
    const dpr = window.devicePixelRatio || 1;
    const size = options.size || 160;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    this.ctx.scale(dpr, dpr);
    this.size = size;

    this._current = 0;
    this._raf = null;
    this.draw(0);
  }

  getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      track: isDark ? 'rgba(217,119,6,0.12)' : 'rgba(120,53,15,0.10)',
      text:  isDark ? '#FAF5EB' : '#1C1409',
      sub:   isDark ? '#A89880' : '#7A5C38',
    };
  }

  draw(current) {
    const ctx  = this.ctx;
    const size = this.size;
    const cx   = size / 2;
    const cy   = size / 2;
    const r    = (size / 2) - (this.lineWidth / 2) - 4;
    const colors = this.getColors();

    ctx.clearRect(0, 0, size, size);

    // Track ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth  = this.lineWidth;
    ctx.strokeStyle = this.trackColor || colors.track;
    ctx.lineCap    = 'round';
    ctx.stroke();

    // Score arc
    const fraction = current / this.maxScore;
    if (fraction > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle   = startAngle + fraction * Math.PI * 2;

      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      grad.addColorStop(0, this.colorStart);
      grad.addColorStop(1, this.colorEnd);

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.lineWidth   = this.lineWidth;
      ctx.strokeStyle = grad;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Dot at end
      const dotAngle = endAngle;
      const dx = cx + r * Math.cos(dotAngle);
      const dy = cy + r * Math.sin(dotAngle);
      ctx.beginPath();
      ctx.arc(dx, dy, this.lineWidth / 2 - 1, 0, Math.PI * 2);
      ctx.fillStyle = this.colorEnd;
      ctx.fill();
    }

    // Inner glow — Ebony
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r - this.lineWidth);
    grd.addColorStop(0, 'rgba(217,119,6,0.08)');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, r - this.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Score number
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = colors.text;
    ctx.font = `900 ${Math.round(size * 0.19)}px Outfit, Inter, sans-serif`;
    ctx.fillText(Math.round(current), cx, cy - size * 0.06);

    // Label
    ctx.font      = `500 ${Math.round(size * 0.085)}px Inter, sans-serif`;
    ctx.fillStyle = colors.sub;
    ctx.fillText('/ 100', cx, cy + size * 0.09);
  }

  animate() {
    if (this._raf) cancelAnimationFrame(this._raf);
    const start  = performance.now();
    const target = this.score;
    const from   = this._current;

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / this.duration, 1);
      const eased    = easeOutExpo(progress);
      this._current  = lerp(from, target, eased);
      this.draw(this._current);
      if (progress < 1) {
        this._raf = requestAnimationFrame(step);
      } else {
        this._current = target;
        this.draw(target);
      }
    };

    this._raf = requestAnimationFrame(step);
  }

  updateTheme() {
    this.draw(this._current);
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

/* ─────────────────────────────────────────
   2. ANIMATED PROGRESS BAR
───────────────────────────────────────── */
function animateProgressBar(fill, targetWidth, delay = 0) {
  fill.style.width = '0%';
  setTimeout(() => {
    fill.style.transition = 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
    fill.style.width = targetWidth + '%';
  }, delay);
}

/* ─────────────────────────────────────────
   3. ANIMATED NUMBER COUNTER
───────────────────────────────────────── */
function animateCounter(el, from, to, duration = 1200, suffix = '') {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = easeOutExpo(progress);
    const val      = Math.round(lerp(from, to, eased));
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────
   4. MINI BAR CHART (section scores)
───────────────────────────────────────── */
class MiniBarChart {
  constructor(container, data) {
    this.container = container;
    this.data = data; // [{label, value, color}]
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.data.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'progress-row';

      const label = document.createElement('span');
      label.className = 'progress-label';
      label.textContent = item.label;

      const track = document.createElement('div');
      track.className = 'progress-track';
      track.style.flex = '1';

      const fill = document.createElement('div');
      fill.className = 'progress-fill';

      // Color based on value
      const v = item.value;
      if (v >= 75)      fill.className += ' progress-fill-success';
      else if (v >= 50) fill.className += ' progress-fill-primary';
      else if (v >= 30) fill.className += ' progress-fill-warning';
      else              fill.className += ' progress-fill-danger';

      track.appendChild(fill);

      const val = document.createElement('span');
      val.className = 'progress-value';
      val.textContent = item.value + '%';

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(val);
      this.container.appendChild(row);

      animateProgressBar(fill, item.value, i * 100 + 200);
    });
  }
}

/* ─────────────────────────────────────────
   5. SCORE RING MINI (for ratings)
───────────────────────────────────────── */
function createScoreRing(value, max, color, size = 48) {
  const canvas = document.createElement('canvas');
  const dpr    = window.devicePixelRatio || 1;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 5;
  const lw = 4;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const trackClr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.lineWidth   = lw;
  ctx.strokeStyle = trackClr;
  ctx.stroke();

  // Fill
  const fraction = value / max;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + fraction * Math.PI * 2);
  ctx.lineWidth   = lw;
  ctx.strokeStyle = color;
  ctx.lineCap     = 'round';
  ctx.stroke();

  return canvas;
}

/* ─────────────────────────────────────────
   6. KEYWORD DENSITY BAR
───────────────────────────────────────── */
function renderKeywordDensityBar(container, presentCount, missingCount) {
  const total = presentCount + missingCount;
  const presentPct = Math.round((presentCount / total) * 100);
  const missingPct = 100 - presentPct;

  container.innerHTML = `
    <div style="display:flex;height:10px;border-radius:999px;overflow:hidden;gap:2px;margin-bottom:6px">
      <div style="flex:${presentPct};background:linear-gradient(90deg,#10b981,#34d399);border-radius:999px 0 0 999px;transition:flex 1s cubic-bezier(0.16,1,0.3,1)"></div>
      <div style="flex:${missingPct};background:linear-gradient(90deg,#ef4444,#f87171);border-radius:0 999px 999px 0;transition:flex 1s cubic-bezier(0.16,1,0.3,1)"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--txt-muted)">
      <span>✓ ${presentCount} found (${presentPct}%)</span>
      <span>✗ ${missingCount} missing (${missingPct}%)</span>
    </div>
  `;
}
