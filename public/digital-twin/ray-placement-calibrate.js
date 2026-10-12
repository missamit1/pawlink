

const PLATE_W = 1024;
const PLATE_H = 640;
const ASSET = 'stage-laptop.jpg';
const STORAGE_KEY = 'pawlink.dev.compositionPresets.v1';

const ANCHORS = [
  { id: 'macbook-16', label: 'MacBook 16', w: 1728, h: 1084 },
  { id: 'ultrawide', label: 'Ultrawide', w: 2514, h: 1328 },
  { id: 'desktop', label: 'Desktop', w: 1920, h: 1080 },
  { id: 'laptop-narrow', label: 'Shorter Laptop', w: 1512, h: 982 },
];

const BG_NEUTRAL = { fit: 'cover', x: 0, y: 0, scale: 1 };

function waitForApi() {
  return new Promise((resolve) => {
    const tick = () => {
      if (window.__pawlinkRayCal?.isReady?.()) resolve(window.__pawlinkRayCal);
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

function fmt(n, d = 3) {
  return Number.isFinite(n) ? Number(n).toFixed(d) : '—';
}

function nearestAnchor(vw, vh) {
  
  for (const a of ANCHORS) {
    if (Math.abs(vw - a.w) <= 24 && Math.abs(vh - a.h) <= 24) {
      return { anchor: a, exact: true }
    }
  }
  for (const a of ANCHORS) {
    if (Math.abs(vw - a.w) <= 48) {
      return { anchor: a, exact: true }
    }
  }
  const aspect = vw / vh
  let best = ANCHORS[0]
  let bestScore = Infinity
  for (const a of ANCHORS) {
    const score =
      Math.abs(aspect - a.w / a.h) * 2.2 +
      Math.abs(vw - a.w) / 2200 +
      Math.abs(vh - a.h) / 1400
    if (score < bestScore) {
      bestScore = score
      best = a
    }
  }
  const exact = Math.abs(vw - best.w) <= 48
  return { anchor: best, exact }
}

function bgDimensions(bg, vw = innerWidth, vh = innerHeight) {
  const fitScale =
    bg.fit === 'contain'
      ? Math.min(vw / PLATE_W, vh / PLATE_H)
      : Math.max(vw / PLATE_W, vh / PLATE_H);
  const s = fitScale * bg.scale;
  return { w: PLATE_W * s, h: PLATE_H * s };
}

function applyBackground(bg) {
  const { w, h } = bgDimensions(bg);
  const body = document.body;
  body.style.setProperty('background-image', `url('./${ASSET}')`, 'important');
  body.style.setProperty('background-repeat', 'no-repeat', 'important');
  body.style.setProperty('background-attachment', 'fixed', 'important');
  body.style.setProperty('background-size', `${w}px ${h}px`, 'important');
  body.style.setProperty('background-position', `${50 + bg.x}% ${50 + bg.y}%`, 'important');
}

function readLiveBackground(fallback) {
  const cs = getComputedStyle(document.body);
  const pos = (cs.backgroundPosition || '50% 50%').split(/\s+/);
  const parsePct = (v, def = 50) => {
    if (v == null) return def;
    if (v.endsWith('%')) return Number.parseFloat(v);
    if (v === 'center') return 50;
    if (v === 'left' || v === 'top') return 0;
    if (v === 'right' || v === 'bottom') return 100;
    return def;
  };
  const posX = parsePct(pos[0], 50);
  const posY = parsePct(pos[1] ?? pos[0], 50);
  const size = cs.backgroundSize || 'cover';
  let fit = fallback.fit;
  let scale = fallback.scale;
  if (size === 'cover') {
    fit = 'cover';
    scale = 1;
  } else if (size === 'contain') {
    fit = 'contain';
    scale = 1;
  } else {
    const parts = size.split(/\s+/);
    const wPx = Number.parseFloat(parts[0]);
    if (Number.isFinite(wPx)) {
      const coverW = Math.max(innerWidth / PLATE_W, innerHeight / PLATE_H) * PLATE_W;
      const containW = Math.min(innerWidth / PLATE_W, innerHeight / PLATE_H) * PLATE_W;
      const coverScale = wPx / coverW;
      const containScale = wPx / containW;
      
      if (Math.abs(coverScale - 1) <= Math.abs(containScale - 1)) {
        fit = 'cover';
        scale = coverScale;
      } else {
        fit = 'contain';
        scale = containScale;
      }
    }
  }
  return {
    fit,
    x: posX - 50,
    y: posY - 50,
    scale: Number.isFinite(scale) ? scale : fallback.scale,
  };
}

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"version":1,"presets":{}}');
  } catch {
    return { version: 1, presets: {} };
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function mountRayPlacementCalibrate() {
  const api = await waitForApi();
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  let editing = false;
  let mode = 'ray'; 
  let selected = false;
  
  let bg = { ...BG_NEUTRAL };
  let bgTouched = false;
  let enterSnapshot = null; 
  let drag = null; 

  const style = document.createElement('style');
  style.textContent = `
#rpc-toolbar{position:fixed;top:10px;right:10px;z-index:100000;display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;max-width:min(420px,calc(100vw - 20px));pointer-events:none}
#rpc-toolbar *{pointer-events:auto}
#rpc-toolbar button{font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:8px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(28,24,20,.88);color:#f4ebe2;cursor:pointer;backdrop-filter:blur(10px)}
#rpc-toolbar button:hover{background:rgba(60,50,42,.94)}
#rpc-toolbar button[aria-pressed=true]{background:#6b2c2e;border-color:#d09090}
#rpc-toolbar button.rpc-primary{background:#6b2c2e}
#rpc-hud{position:fixed;left:10px;bottom:10px;z-index:100000;min-width:168px;padding:10px 12px;border-radius:10px;background:rgba(20,16,14,.86);color:#f0e6dc;border:1px solid rgba(255,255,255,.14);font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;backdrop-filter:blur(10px);pointer-events:none;display:none;white-space:pre}
#rpc-hud strong{display:block;margin-bottom:4px;font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;color:#c4a994}
#rpc-toast{position:fixed;top:52px;right:10px;z-index:100001;padding:7px 10px;border-radius:8px;background:rgba(28,24,20,.92);color:#f0dcc8;font:11px/1.3 ui-sans-serif,system-ui,sans-serif;opacity:0;transition:opacity .2s;pointer-events:none}
#rpc-toast.show{opacity:1}
#rpc-outline{position:fixed;inset:0;z-index:99999;pointer-events:none;display:none}
#rpc-outline .rpc-box{position:absolute;border:1px solid rgba(255,255,255,.42);box-shadow:0 0 0 1px rgba(0,0,0,.15);border-radius:2px}
#rpc-outline .rpc-handle{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:2px;background:rgba(255,255,255,.9);border:1px solid rgba(60,40,30,.55);pointer-events:auto;cursor:nwse-resize}
body.rpc-editing.rpc-mode-ray canvas{cursor:grab}
body.rpc-editing.rpc-mode-ray.rpc-dragging canvas{cursor:grabbing}
body.rpc-editing.rpc-mode-background canvas{cursor:move}
`;
  document.head.append(style);

  const toolbar = document.createElement('div');
  toolbar.id = 'rpc-toolbar';
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'rpc-primary';
  editBtn.textContent = 'Edit Composition';
  const rayBtn = document.createElement('button');
  rayBtn.type = 'button';
  rayBtn.textContent = 'Ray';
  rayBtn.hidden = true;
  const bgBtn = document.createElement('button');
  bgBtn.type = 'button';
  bgBtn.textContent = 'Background';
  bgBtn.hidden = true;
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save Composition';
  saveBtn.hidden = true;
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = 'Reset';
  resetBtn.hidden = true;
  const doneBtn = document.createElement('button');
  doneBtn.type = 'button';
  doneBtn.textContent = 'Done';
  doneBtn.hidden = true;
  toolbar.append(editBtn, rayBtn, bgBtn, saveBtn, resetBtn, doneBtn);
  document.body.append(toolbar);

  const hud = document.createElement('pre');
  hud.id = 'rpc-hud';
  hud.innerHTML = '<strong>RAY</strong>';
  document.body.append(hud);

  const toast = document.createElement('div');
  toast.id = 'rpc-toast';
  document.body.append(toast);

  const outline = document.createElement('div');
  outline.id = 'rpc-outline';
  outline.innerHTML = '<div class="rpc-box"></div><div class="rpc-handle" title="Scale"></div>';
  document.body.append(outline);
  const boxEl = outline.querySelector('.rpc-box');
  const handleEl = outline.querySelector('.rpc-handle');

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const syncModeButtons = () => {
    rayBtn.setAttribute('aria-pressed', mode === 'ray' ? 'true' : 'false');
    bgBtn.setAttribute('aria-pressed', mode === 'background' ? 'true' : 'false');
    document.body.classList.toggle('rpc-mode-ray', editing && mode === 'ray');
    document.body.classList.toggle('rpc-mode-background', editing && mode === 'background');
  };

  const setEditing = (on) => {
    editing = on;
    document.body.classList.toggle('rpc-editing', on);
    rayBtn.hidden = bgBtn.hidden = saveBtn.hidden = resetBtn.hidden = doneBtn.hidden = !on;
    editBtn.hidden = on;
    hud.style.display = on ? 'block' : 'none';
    outline.style.display = on && mode === 'ray' && selected ? 'block' : 'none';
    if (on) {
      const enabled = api.get() || api.enable();
      enterSnapshot = {
        ray: { ...enabled },
        bg: { ...bg },
      };
      
      api.rebase?.();
      enterSnapshot.ray = { ...api.get() };
      selected = true;
      mode = 'ray';
      syncModeButtons();
    } else {
      selected = false;
      drag = null;
      document.body.classList.remove('rpc-dragging');
      
      syncModeButtons();
    }
  };

  editBtn.addEventListener('click', () => setEditing(true));
  doneBtn.addEventListener('click', () => {
    setEditing(false);
    showToast('Composition locked');
  });
  rayBtn.addEventListener('click', () => {
    mode = 'ray';
    selected = true;
    syncModeButtons();
    outline.style.display = 'block';
  });
  bgBtn.addEventListener('click', () => {
    mode = 'background';
    selected = false;
    syncModeButtons();
    outline.style.display = 'none';
    if (!bgTouched) {
      
      bgTouched = true;
    }
  });

  resetBtn.addEventListener('click', () => {
    if (!enterSnapshot) return;
    api.set({ ...enterSnapshot.ray });
    bg = { ...enterSnapshot.bg };
    applyBackground(bg);
    showToast('Reset to edit-entry values');
  });

  saveBtn.addEventListener('click', () => {
    const m = api.measure();
    const match = nearestAnchor(m.vw, m.vh);
    const a = match.anchor;
    if (!match.exact) {
      showToast(
        `Resize to an anchor first. Now ${m.vw}×${m.vh} · nearest ${a.label} (${a.w}×${a.h})`,
      );
      return;
    }
    const cal = api.get();
    const framing = api.liveFraming?.() || {};
    const liveBg = bgTouched ? bg : readLiveBackground(bg);
    const store = loadStore();
    store.presets[a.id] = {
      ray: {
        x: cal.x,
        y: cal.y,
        z: cal.z,
        scale: cal.scale,
        frameX: framing.frameX ?? cal.frameX,
        frameY: framing.frameY ?? cal.frameY,
      },
      background: {
        asset: ASSET,
        fit: liveBg.fit,
        x: liveBg.x,
        y: liveBg.y,
        scale: liveBg.scale,
      },
      composition: {
        width: m.vw,
        height: m.vh,
        aspect: m.vw / m.vh,
        anchorWidth: a.w,
        anchorHeight: a.h,
        anchorAspect: a.w / a.h,
      },
      measurements: {
        lowestPawY: m.lowestPaw,
        dockTopY: m.dockTop,
        gap: m.gap,
        bbox: m.bbox,
      },
      savedAt: new Date().toISOString(),
    };
    saveStore(store);
    const dump = JSON.stringify(store.presets[a.id], null, 2);
    const text = [`${a.label} — ${a.w}×${a.h}`, `viewport: ${m.vw}×${m.vh}`, '', dump].join('\n');
    try {
      navigator.clipboard.writeText(text);
      showToast(`Saved + copied → ${a.label}`);
    } catch {
      showToast(`Saved → ${a.label} — ${m.vw}×${m.vh}`);
    }
    console.info(`[PawLink DEV] ${a.label} composition saved:\n` + text);
  });

  const inBBox = (x, y, bbox, pad = 8) =>
    bbox && x >= bbox.minX - pad && x <= bbox.maxX + pad && y >= bbox.minY - pad && y <= bbox.maxY + pad;

  const pointerToLocal = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * innerWidth,
      y: ((e.clientY - rect.top) / rect.height) * innerHeight,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  };

  const onPointerDown = (e) => {
    if (!editing || e.button !== 0) return;
    const p = pointerToLocal(e);
    if (mode === 'background') {
      drag = { kind: 'bg', x0: p.x, y0: p.y, bgX0: bg.x, bgY0: bg.y };
      document.body.classList.add('rpc-dragging');
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (e.target === handleEl) {
      const cal = api.get();
      const bbox = api.screenBBox();
      const cx = (bbox.minX + bbox.maxX) / 2;
      const cy = (bbox.minY + bbox.maxY) / 2;
      drag = {
        kind: 'scale',
        x0: p.x,
        y0: p.y,
        dist0: Math.hypot(p.x - cx, p.y - cy) || 1,
        scale0: cal.scale,
        cx,
        cy,
      };
      document.body.classList.add('rpc-dragging');
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const hit = api.hitTest(e.clientX, e.clientY) || inBBox(p.x, p.y, api.screenBBox());
    if (!hit) {
      selected = false;
      outline.style.display = 'none';
      return;
    }
    selected = true;
    outline.style.display = 'block';
    const cal = api.get();
    drag = {
      kind: e.altKey ? 'depth' : 'move',
      x0: p.x,
      y0: p.y,
      frameX0: cal.frameX,
      frameY0: cal.frameY,
      z0: cal.z,
    };
    document.body.classList.add('rpc-dragging');
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerMove = (e) => {
    if (!editing || !drag) return;
    const p = pointerToLocal(e);
    const dx = p.x - drag.x0;
    const dy = p.y - drag.y0;
    if (drag.kind === 'move') {
      
      api.set({ frameX: drag.frameX0 + dx, frameY: drag.frameY0 + dy });
    } else if (drag.kind === 'depth') {
      api.set({ z: drag.z0 - dy * 0.0015 });
    } else if (drag.kind === 'scale') {
      const dist = Math.hypot(p.x - drag.cx, p.y - drag.cy) || 1;
      const next = Math.max(0.15, Math.min(3, drag.scale0 * (dist / drag.dist0)));
      api.set({ scale: next });
    } else if (drag.kind === 'bg') {
      
      bgTouched = true;
      bg.x = Math.max(-50, Math.min(50, drag.bgX0 + dx * 0.05));
      bg.y = Math.max(-50, Math.min(50, drag.bgY0 + dy * 0.05));
      applyBackground(bg);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerUp = () => {
    if (!drag) return;
    drag = null;
    document.body.classList.remove('rpc-dragging');
  };

  const onWheel = (e) => {
    if (!editing) return;
    const p = pointerToLocal(e);
    if (mode === 'background') {
      e.preventDefault();
      e.stopPropagation();
      bgTouched = true;
      const step = e.shiftKey ? 0.002 : 0.01;
      const dir = e.deltaY > 0 ? -1 : 1;
      bg.scale = Math.max(1, Math.min(1.35, bg.scale + dir * step));
      applyBackground(bg);
      return;
    }
    const overRay =
      selected || api.hitTest(e.clientX, e.clientY) || inBBox(p.x, p.y, api.screenBBox(), 20);
    if (!overRay) return;
    e.preventDefault();
    e.stopPropagation();
    const cal = api.get();
    const step = e.shiftKey ? 0.004 : 0.018;
    const dir = e.deltaY > 0 ? -1 : 1;
    api.set({ scale: Math.max(0.15, Math.min(3, cal.scale * (1 + dir * step))) });
    selected = true;
    outline.style.display = 'block';
  };

  const onKeyDown = (e) => {
    if (!editing || !selected || mode !== 'ray') return;
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    const step = e.shiftKey ? 10 : 1;
    const cal = api.get();
    let handled = true;
    if (e.key === 'ArrowLeft') api.set({ frameX: cal.frameX - step });
    else if (e.key === 'ArrowRight') api.set({ frameX: cal.frameX + step });
    else if (e.key === 'ArrowUp') api.set({ frameY: cal.frameY - step });
    else if (e.key === 'ArrowDown') api.set({ frameY: cal.frameY + step });
    else handled = false;
    if (handled) e.preventDefault();
  };

  
  canvas.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('pointermove', onPointerMove, true);
  window.addEventListener('pointerup', onPointerUp, true);
  canvas.addEventListener('wheel', onWheel, { capture: true, passive: false });
  window.addEventListener('keydown', onKeyDown, true);
  handleEl.addEventListener('pointerdown', onPointerDown);

  addEventListener('resize', () => {
    if (bgTouched) applyBackground(bg);
  });

  const tick = () => {
    if (editing) {
      const m = api.measure();
      const c = api.get() || m.cal || {};
      const framing = api.liveFraming?.() || {
        frameX: c.frameX,
        frameY: c.frameY,
      };
      const liveBg = bgTouched ? bg : readLiveBackground(bg);
      if (!bgTouched) Object.assign(bg, liveBg);
      const match = nearestAnchor(m.vw, m.vh);
      const aspect = m.vw / m.vh;
      hud.innerHTML = [
        '<strong>RAY</strong>',
        `X ${fmt(c.x, 4)}`,
        `Y ${fmt(c.y, 4)}`,
        `Z ${fmt(c.z, 4)}`,
        `Scale ${fmt(c.scale, 4)}`,
        `frameX ${fmt(framing.frameX, 4)}`,
        `frameY ${fmt(framing.frameY, 4)}`,
        '',
        '<strong>BACKGROUND</strong>',
        `X ${fmt(liveBg.x, 2)}`,
        `Y ${fmt(liveBg.y, 2)}`,
        `Zoom ${fmt(liveBg.scale, 3)}`,
        `Fit ${liveBg.fit}`,
        '',
        `Viewport: ${m.vw} × ${m.vh}`,
        `Aspect: ${fmt(aspect, 3)}`,
        match.exact
          ? `Anchor: ${match.anchor.label} — ${match.anchor.w}×${match.anchor.h}`
          : `Anchor: nearest ${match.anchor.label}`,
        `Paw → Dock: ${fmt(m.gap, 1)}px`,
      ].join('\n');

      if (mode === 'ray' && selected) {
        const b = m.bbox;
        if (b) {
          outline.style.display = 'block';
          boxEl.style.left = `${b.minX}px`;
          boxEl.style.top = `${b.minY}px`;
          boxEl.style.width = `${b.w}px`;
          boxEl.style.height = `${b.h}px`;
          handleEl.style.left = `${b.maxX}px`;
          handleEl.style.top = `${b.maxY}px`;
        }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  console.info('[PawLink DEV] Direct composition editor ready — Edit Composition');
}
