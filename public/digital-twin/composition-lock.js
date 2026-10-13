/**
 * LOCKED 2026-09-28 — Dashboard Ray composition.
 * MACBOOK_16 is the product art lock. Do not change bake numbers or unlock
 * without Amit explicitly lifting `.cursor/rules/ray-composition-lock.mdc`.
 *
 * Exact art-directed composition anchors.
 * Values come from live HUD CleanShots — no inferred framing.
 */

const PLATE_W = 1024;
const PLATE_H = 640;

export const MACBOOK_16 = {
  id: 'macbook-16',
  label: 'MacBook 16',
  w: 1728,
  h: 1084,
  ray: {
    x: 0,
    y: -0.018,
    z: 0,
    scale: 0.9776,
    frameX: 863.56,
    frameY: 686.45,
  },
  background: {
    asset: 'stage-laptop.jpg',
    fit: 'cover',
    x: 0,
    y: 0,
    scale: 1,
  },
  heroScale: 0.85,
  measurements: {
    gap: 175.5,
    viewport: { width: 1728, height: 1084 },
    aspect: 1.594,
  },
};

/** Source: live HUD CleanShot 2026-09-28 — Ultrawide 2514×1328. */
export const ULTRAWIDE = {
  id: 'ultrawide',
  label: 'Ultrawide',
  w: 2514,
  h: 1328,
  ray: {
    x: 0,
    y: -0.018,
    z: 0,
    scale: 0.9785,
    frameX: 1135.5456,
    frameY: 874.2625,
  },
  background: {
    asset: 'stage-laptop.jpg',
    fit: 'cover',
    x: 0,
    y: 0,
    scale: 1,
  },
  heroScale: 0.85,
  measurements: {
    gap: 220.8,
    viewport: { width: 2514, height: 1328 },
    aspect: 1.893,
  },
};

/** Source: live HUD Save 2026-09-28 — Desktop 1920×1080. */
export const DESKTOP = {
  id: 'desktop',
  label: 'Desktop',
  w: 1920,
  h: 1080,
  ray: {
    x: 0,
    y: -0.01799960926987433,
    z: 0,
    scale: 0.9957961784083789,
    frameX: 977.6934179687502,
    frameY: 716.7223693847657,
  },
  background: {
    asset: 'stage-laptop.jpg',
    fit: 'cover',
    x: 3.223773193359375,
    y: -13.427176666259767,
    scale: 1,
  },
  heroScale: 0.85,
  measurements: {
    gap: 140.2576591487026,
    viewport: { width: 1920, height: 1080 },
    aspect: 1.7777777777777777,
  },
};

/** Source: live HUD CleanShot 2026-09-28 — Shorter Laptop 1512×982. */
export const LAPTOP_NARROW = {
  id: 'laptop-narrow',
  label: 'Shorter Laptop',
  w: 1512,
  h: 982,
  ray: {
    x: 0,
    y: -0.018,
    z: 0,
    scale: 0.9427,
    frameX: 757.3064,
    frameY: 617.3193,
  },
  background: {
    asset: 'stage-laptop.jpg',
    fit: 'cover',
    x: 3.22,
    y: -13.43,
    scale: 1,
  },
  heroScale: 0.85,
  measurements: {
    gap: 149.2,
    viewport: { width: 1512, height: 982 },
    aspect: 1.54,
  },
};

export const LOCKED_PRESETS = [MACBOOK_16, ULTRAWIDE, DESKTOP, LAPTOP_NARROW];

/**
 * Dashboard embed only — MacBook lock stays default.
 * Ultrawide viewports use the existing ULTRAWIDE bake (no MacBook number edits).
 * Approved 2026-10-01 by Amit: ultrawide only; do not touch MACBOOK_16 bake values.
 */
export function pickDashboardPreset(w, h) {
  const width = Number(w) || 0
  const height = Math.max(Number(h) || 1, 1)
  const aspect = width / height
  // ULTRAWIDE bake = 2514×1328 (~1.89). Only clearly wide screens.
  if (width >= 2200 || (width >= 2000 && aspect >= 1.78)) {
    return ULTRAWIDE
  }
  return MACBOOK_16
}

/**
 * Match a locked bake to the live Twin viewport.
 * Desktop always gets a bake (nearest). Height may drift with chrome;
 * framing scales via snapshotFromPreset.
 */
const MATCH_W = 80

export function matchPreset(w, h) {
  if (!(w > 700)) return null

  const aspect = w / Math.max(h, 1)
  const scored = LOCKED_PRESETS.map((p) => {
    const dw = Math.abs(w - p.w)
    const dh = Math.abs(h - p.h)
    const da = Math.abs(aspect - p.w / p.h)
    const score = dw + dh * 0.35 + da * 900
    return { p, score, dw }
  }).sort((a, b) => a.score - b.score || a.dw - b.dw)

  // Prefer a close width hit when one exists; otherwise nearest overall.
  const widthHit = scored.find((x) => x.dw <= MATCH_W)
  return (widthHit ?? scored[0]).p
}

export function matchMacbook16(w, h) {
  return matchPreset(w, h)?.id === 'macbook-16'
}

/**
 * @param {{ w?: number, h?: number } | null} [viewport]
 * When viewport differs slightly from the bake window, scale frameX/frameY
 * so the approved composition stays proportionally locked.
 */
export function snapshotFromPreset(preset, viewport = null) {
  const r = preset.ray
  const w = Number.isFinite(viewport?.w) ? viewport.w : preset.w
  const h = Number.isFinite(viewport?.h) ? viewport.h : preset.h
  const sx = w / preset.w
  const sy = h / preset.h
  return {
    x: r.x,
    y: r.y,
    z: r.z,
    scale: r.scale,
    frameX: r.frameX * sx,
    frameY: r.frameY * sy,
    heroScale: preset.heroScale,
  }
}

export function macbook16Snapshot() {
  return snapshotFromPreset(MACBOOK_16);
}

export function applyPresetBackground(preset, body = document.body) {
  const b = preset.background;
  const fitScale =
    b.fit === 'contain'
      ? Math.min(innerWidth / PLATE_W, innerHeight / PLATE_H)
      : Math.max(innerWidth / PLATE_W, innerHeight / PLATE_H);
  const s = fitScale * b.scale;
  body.style.setProperty('background-color', '#c9c1b5', 'important');
  body.style.setProperty('background-image', `url('./${b.asset}')`, 'important');
  body.style.setProperty('background-repeat', 'no-repeat', 'important');
  // MACBOOK_16 bake was approved with attachment:fixed + plate pixel size.
  // Do not switch to scroll/cover — that drifts Ray off the marble stage.
  body.style.setProperty('background-attachment', 'fixed', 'important');
  body.style.setProperty(
    'background-size',
    `${PLATE_W * s}px ${PLATE_H * s}px`,
    'important',
  );
  body.style.setProperty('background-position', `${50 + b.x}% ${50 + b.y}%`, 'important');
}

export function applyMacbook16Background(body = document.body) {
  applyPresetBackground(MACBOOK_16, body);
}
