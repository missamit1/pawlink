

const IMAGES = [
  "../assets/campaign/backs.webp",
  "../assets/campaign/black-portrait.webp",
  "../assets/campaign/bond.webp",
  "../assets/campaign/circle.webp",
  "../assets/campaign/duo.webp",
  "../assets/campaign/hello.webp",
  "../assets/campaign/home.webp",
  "../assets/campaign/icons.webp",
  "../assets/campaign/little-big.webp",
  "../assets/campaign/outside.webp",
  "../assets/campaign/pack.webp",
  "../assets/campaign/rest.webp",
  "../assets/campaign/rose-pack.webp",
  "../assets/campaign/terrier.webp",
  "../assets/campaign/trio.webp",
  "../assets/campaign/walk.webp"
];

const FRICTION = 0.9;           
const WHEEL_SENS = 0.6;         
const DRAG_SENS = 1.0;          

const MAX_ROTATION = 28;        
const MAX_DEPTH = 140;          
const MIN_SCALE = 0.92;         
const SCALE_RANGE = 0.1;        
const GAP = 28;                 

const stage = document.querySelector('.stage');
const cardsRoot = document.getElementById('cards');
const bgCanvas = document.getElementById('bg');
const bgCtx = bgCanvas?.getContext('2d', { alpha: false });
const loader = document.getElementById('loader');

let items = [];                 
let positions = [];             
let activeIndex = -1;           
let isEntering = true;          

let CARD_W = 300;               
let CARD_H = 400;               
let STEP = CARD_W + GAP;        
let TRACK = 0;                  
let SCROLL_X = 0;               
let VW_HALF = window.innerWidth * 0.5;

let vX = 0;                     

let rafId = null;               
let bgRAF = null;               
let lastTime = 0;               
let lastBgDraw = 0;             

let gradPalette = [];           
let gradCurrent = {             
  r1: 240, g1: 240, b1: 240,    
  r2: 235, g2: 235, b2: 235     
};
let bgFastUntil = 0;            

function mod(n, m) {
  return ((n % m) + m) % m;
}

function preloadImageLinks(srcs) {
  if (!document.head) return;
  
  srcs.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

function waitForImages() {
  const promises = items.map((it) => {
    const img = it.el.querySelector('img');
    if (!img || img.complete) return Promise.resolve();

    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  });

  return Promise.all(promises);
}

async function decodeAllImages() {
  const tasks = items.map((it) => {
    const img = it.el.querySelector('img');
    if (!img) return Promise.resolve();

    if (typeof img.decode === 'function') {
      return img.decode().catch(() => {});
    }

    return Promise.resolve();
  });

  await Promise.allSettled(tasks);
}

function createCards() {
  cardsRoot.innerHTML = '';
  items = [];

  const fragment = document.createDocumentFragment();

  IMAGES.forEach((src, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.willChange = 'transform'; 

    const img = new Image();
    img.className = 'card__img';
    img.alt = 'PawLink campaign — ' + src.split('/').pop().replace('.webp', '').replaceAll('-', ' ');
    img.decoding = 'async';
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.draggable = false;
    img.src = src;

    card.appendChild(img);
    fragment.appendChild(card);
    items.push({ el: card, x: i * STEP });
  });

  cardsRoot.appendChild(fragment);
}

function measure() {
  const sample = items[0]?.el;
  if (!sample) return;

  const r = sample.getBoundingClientRect();
  CARD_W = r.width || CARD_W;
  CARD_H = r.height || CARD_H;
  STEP = CARD_W + GAP;
  TRACK = items.length * STEP;

  
  items.forEach((it, i) => {
    it.x = i * STEP;
  });

  positions = new Float32Array(items.length);
}

function computeTransformComponents(screenX) {
  const norm = Math.max(-1, Math.min(1, screenX / VW_HALF));
  const absNorm = Math.abs(norm);
  const invNorm = 1 - absNorm;

  const ry = -norm * MAX_ROTATION;
  const tz = invNorm * MAX_DEPTH;
  const scale = MIN_SCALE + invNorm * SCALE_RANGE;

  return { norm, absNorm, invNorm, ry, tz, scale };
}

function transformForScreenX(screenX) {
  const { ry, tz, scale } = computeTransformComponents(screenX);

  return {
    transform: `translate3d(${screenX}px,-50%,${tz}px) rotateY(${ry}deg) scale(${scale})`,
    z: tz,
  };
}

function updateCarouselTransforms() {
  const half = TRACK / 2;
  let closestIdx = -1;
  let closestDist = Infinity;

  
  for (let i = 0; i < items.length; i++) {
    let pos = items[i].x - SCROLL_X;
    
    
    if (pos < -half) pos += TRACK;
    if (pos > half) pos -= TRACK;
    
    positions[i] = pos;

    
    const dist = Math.abs(pos);
    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = i;
    }
  }

  
  const prevIdx = (closestIdx - 1 + items.length) % items.length;
  const nextIdx = (closestIdx + 1) % items.length;

  
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const pos = positions[i];
    const norm = Math.max(-1, Math.min(1, pos / VW_HALF));
    const { transform, z } = transformForScreenX(pos);

    it.el.style.transform = transform;
    it.el.style.zIndex = String(1000 + Math.round(z)); 

    
    const isCore = i === closestIdx || i === prevIdx || i === nextIdx;
    const blur = isCore ? 0 : 2 * Math.pow(Math.abs(norm), 1.1);
    it.el.style.filter = `blur(${blur.toFixed(2)}px)`;
  }

  
  if (closestIdx !== activeIndex) {
    setActiveGradient(closestIdx);
  }
}

function tick(t) {
  const dt = lastTime ? (t - lastTime) / 1000 : 0;
  lastTime = t;

  
  SCROLL_X = mod(SCROLL_X + vX * dt, TRACK);

  
  const decay = Math.pow(FRICTION, dt * 60);
  vX *= decay;
  if (Math.abs(vX) < 0.02) vX = 0;

  updateCarouselTransforms();
  rafId = requestAnimationFrame(tick);
}

function startCarousel() {
  cancelCarousel();
  lastTime = 0;
  rafId = requestAnimationFrame((t) => {
    updateCarouselTransforms();
    tick(t);
  });
}

function cancelCarousel() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function fallbackFromIndex(idx) {
  const h = (idx * 37) % 360; 
  const s = 0.65;
  const c1 = hslToRgb(h, s, 0.52);
  const c2 = hslToRgb(h, s, 0.72);
  return { c1, c2 };
}

function extractColors(img, idx) {
  try {
    
    const MAX = 48;
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
    const tw = ratio >= 1 ? MAX : Math.max(16, Math.round(MAX * ratio));
    const th = ratio >= 1 ? Math.max(16, Math.round(MAX / ratio)) : MAX;

    
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, tw, th);
    const data = ctx.getImageData(0, 0, tw, th).data;

    
    const H_BINS = 36; 
    const S_BINS = 5;  
    const SIZE = H_BINS * S_BINS;
    const wSum = new Float32Array(SIZE); 
    const rSum = new Float32Array(SIZE); 
    const gSum = new Float32Array(SIZE); 
    const bSum = new Float32Array(SIZE); 

    
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3] / 255;
      if (a < 0.05) continue; 

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const [h, s, l] = rgbToHsl(r, g, b);

      
      if (l < 0.1 || l > 0.92 || s < 0.08) continue;

      
      const w = a * (s * s) * (1 - Math.abs(l - 0.5) * 0.6);
      
      
      const hi = Math.max(0, Math.min(H_BINS - 1, Math.floor((h / 360) * H_BINS)));
      const si = Math.max(0, Math.min(S_BINS - 1, Math.floor(s * S_BINS)));
      const bidx = hi * S_BINS + si;

      
      wSum[bidx] += w;
      rSum[bidx] += r * w;
      gSum[bidx] += g * w;
      bSum[bidx] += b * w;
    }

    
    let pIdx = -1;
    let pW = 0;
    for (let i = 0; i < SIZE; i++) {
      if (wSum[i] > pW) {
        pW = wSum[i];
        pIdx = i;
      }
    }

    if (pIdx < 0 || pW <= 0) return fallbackFromIndex(idx);

    const pHue = Math.floor(pIdx / S_BINS) * (360 / H_BINS);

    
    let sIdx = -1;
    let sW = 0;
    for (let i = 0; i < SIZE; i++) {
      const w = wSum[i];
      if (w <= 0) continue;
      
      const h = Math.floor(i / S_BINS) * (360 / H_BINS);
      let dh = Math.abs(h - pHue);
      dh = Math.min(dh, 360 - dh); 
      
      if (dh >= 25 && w > sW) { 
        sW = w;
        sIdx = i;
      }
    }

    
    const avgRGB = (idx) => {
      const w = wSum[idx] || 1e-6;
      return [
        Math.round(rSum[idx] / w),
        Math.round(gSum[idx] / w),
        Math.round(bSum[idx] / w)
      ];
    };

    
    const [pr, pg, pb] = avgRGB(pIdx);
    let [h1, s1] = rgbToHsl(pr, pg, pb);
    s1 = Math.max(0.45, Math.min(1, s1 * 1.15)); 
    const c1 = hslToRgb(h1, s1, 0.5);

    
    let c2;
    if (sIdx >= 0 && sW >= pW * 0.6) {
      
      const [sr, sg, sb] = avgRGB(sIdx);
      let [h2, s2] = rgbToHsl(sr, sg, sb);
      s2 = Math.max(0.45, Math.min(1, s2 * 1.05));
      c2 = hslToRgb(h2, s2, 0.72);
    } else {
      
      c2 = hslToRgb(h1, s1, 0.72);
    }

    return { c1, c2 };
  } catch {
    return fallbackFromIndex(idx);
  }
}

function buildPalette() {
  gradPalette = items.map((it, i) => {
    const img = it.el.querySelector('img');
    return extractColors(img, i);
  });
}

function setActiveGradient(idx) {
  if (!bgCtx || idx < 0 || idx >= items.length || idx === activeIndex) return;

  activeIndex = idx;
  const pal = gradPalette[idx] || { c1: [240, 240, 240], c2: [235, 235, 235] };
  const to = {
    r1: pal.c1[0],
    g1: pal.c1[1],
    b1: pal.c1[2],
    r2: pal.c2[0],
    g2: pal.c2[1],
    b2: pal.c2[2],
  };

  
  if (window.gsap) {
    bgFastUntil = performance.now() + 800; 
    window.gsap.to(gradCurrent, { ...to, duration: 0.45, ease: 'power2.out' });
  } else {
    Object.assign(gradCurrent, to);
  }
}

function resizeBG() {
  if (!bgCanvas || !bgCtx) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = bgCanvas.clientWidth || stage.clientWidth;
  const h = bgCanvas.clientHeight || stage.clientHeight;
  const tw = Math.floor(w * dpr);
  const th = Math.floor(h * dpr);

  if (bgCanvas.width !== tw || bgCanvas.height !== th) {
    bgCanvas.width = tw;
    bgCanvas.height = th;
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function drawBackground() {
  if (!bgCanvas || !bgCtx) return;

  const now = performance.now();
  const minInterval = now < bgFastUntil ? 16 : 33; 

  
  if (now - lastBgDraw < minInterval) {
    bgRAF = requestAnimationFrame(drawBackground);
    return;
  }

  lastBgDraw = now;
  resizeBG();

  const w = bgCanvas.clientWidth || stage.clientWidth;
  const h = bgCanvas.clientHeight || stage.clientHeight;

  
  bgCtx.fillStyle = '#f6f7f9';
  bgCtx.fillRect(0, 0, w, h);

  
  const time = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : now * 0.0002;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const a1 = Math.min(w, h) * 0.35; 
  const a2 = Math.min(w, h) * 0.28; 

  
  const x1 = cx + Math.cos(time) * a1;
  const y1 = cy + Math.sin(time * 0.8) * a1 * 0.4;
  const x2 = cx + Math.cos(-time * 0.9 + 1.2) * a2;
  const y2 = cy + Math.sin(-time * 0.7 + 0.7) * a2 * 0.5;

  const r1 = Math.max(w, h) * 0.75; 
  const r2 = Math.max(w, h) * 0.65; 

  
  const g1 = bgCtx.createRadialGradient(x1, y1, 0, x1, y1, r1);
  g1.addColorStop(0, `rgba(${gradCurrent.r1},${gradCurrent.g1},${gradCurrent.b1},0.85)`);
  g1.addColorStop(1, 'rgba(255,255,255,0)');
  bgCtx.fillStyle = g1;
  bgCtx.fillRect(0, 0, w, h);

  
  const g2 = bgCtx.createRadialGradient(x2, y2, 0, x2, y2, r2);
  g2.addColorStop(0, `rgba(${gradCurrent.r2},${gradCurrent.g2},${gradCurrent.b2},0.70)`);
  g2.addColorStop(1, 'rgba(255,255,255,0)');
  bgCtx.fillStyle = g2;
  bgCtx.fillRect(0, 0, w, h);

  bgRAF = requestAnimationFrame(drawBackground);
}

function startBG() {
  if (!bgCanvas || !bgCtx) return;
  cancelBG();
  bgRAF = requestAnimationFrame(drawBackground);
}

function cancelBG() {
  if (bgRAF) cancelAnimationFrame(bgRAF);
  bgRAF = null;
}

function onResize() {
  const prevStep = STEP || 1;
  const ratio = SCROLL_X / (items.length * prevStep);
  measure();
  VW_HALF = window.innerWidth * 0.5;
  SCROLL_X = mod(ratio * TRACK, TRACK);
  updateCarouselTransforms();
  resizeBG();
}

stage.addEventListener(
  'wheel',
  (e) => {
    if (isEntering) return;
    e.preventDefault();

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    vX += delta * WHEEL_SENS * 20;
  },
  { passive: false }
);

stage.addEventListener('dragstart', (e) => e.preventDefault());

let dragging = false;
let lastX = 0;
let lastT = 0;
let lastDelta = 0;

stage.addEventListener('pointerdown', (e) => {
  if (isEntering) return;
  if (e.target.closest('.frame')) return;
  
  dragging = true;
  lastX = e.clientX;
  lastT = performance.now();
  lastDelta = 0;
  stage.setPointerCapture(e.pointerId);
  stage.classList.add('dragging');
});

stage.addEventListener('pointermove', (e) => {
  if (!dragging) return;

  const now = performance.now();
  const dx = e.clientX - lastX;
  const dt = Math.max(1, now - lastT) / 1000;

  SCROLL_X = mod(SCROLL_X - dx * DRAG_SENS, TRACK);
  lastDelta = dx / dt; 
  lastX = e.clientX;
  lastT = now;
});

stage.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  dragging = false;
  stage.releasePointerCapture(e.pointerId);
  vX = -lastDelta * DRAG_SENS; 
  stage.classList.remove('dragging');
});

window.addEventListener('resize', () => {
  clearTimeout(onResize._t);
  onResize._t = setTimeout(onResize, 80);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelCarousel();
    cancelBG();
  } else {
    startCarousel();
    startBG();
  }
});

async function animateEntry(visibleCards) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  await new Promise((r) => requestAnimationFrame(r));

  const tl = window.gsap.timeline();

  visibleCards.forEach(({ item, screenX }, idx) => {
    const state = { p: 0 }; 
    const { ry, tz, scale: baseScale } = computeTransformComponents(screenX);

    const START_SCALE = 0.92;
    const START_Y = 40;

    item.el.style.opacity = '0';
    item.el.style.transform =
      `translate3d(${screenX}px,-50%,${tz}px) ` +
      `rotateY(${ry}deg) ` +
      `scale(${START_SCALE}) ` +
      `translateY(${START_Y}px)`;

    tl.to(
      state,
      {
        p: 1,
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: () => {
          const t = state.p;

          const currentScale = START_SCALE + (baseScale - START_SCALE) * t;
          const currentY = START_Y * (1 - t);
          const opacity = t;

          item.el.style.opacity = opacity.toFixed(3);

          if (t >= 0.999) {
            const { transform } = transformForScreenX(screenX);
            item.el.style.transform = transform;
          } else {
            item.el.style.transform =
              `translate3d(${screenX}px,-50%,${tz}px) ` +
              `rotateY(${ry}deg) ` +
              `scale(${currentScale}) ` +
              `translateY(${currentY}px)`;
          }
        },
      },
      idx * 0.05
    );
  });

  await new Promise((resolve) => {
    tl.eventCallback('onComplete', resolve);
  });
}

async function warmupCompositing() {
  const originalScrollX = SCROLL_X;
  const stepSize = STEP * 0.5;
  const numSteps = Math.ceil(TRACK / stepSize);

  
  for (let i = 0; i < numSteps; i++) {
    SCROLL_X = mod(originalScrollX + i * stepSize, TRACK);
    updateCarouselTransforms();

    
    if (i % 3 === 0) {
      await new Promise((r) => requestAnimationFrame(r));
    }
  }

  
  SCROLL_X = originalScrollX;
  updateCarouselTransforms();
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));
}

async function init() {
  
  preloadImageLinks(IMAGES);
  
  
  createCards();
  measure();
  updateCarouselTransforms();
  stage.classList.add('carousel-mode');

  
  await waitForImages();

  
  await decodeAllImages();

  
  items.forEach((it) => {
    const img = it.el.querySelector('img');
    if (img) void img.offsetHeight;
  });

  
  buildPalette();

  
  const half = TRACK / 2;
  let closestIdx = 0;
  let closestDist = Infinity;

  for (let i = 0; i < items.length; i++) {
    let pos = items[i].x - SCROLL_X;
    if (pos < -half) pos += TRACK;
    if (pos > half) pos -= TRACK;
    const d = Math.abs(pos);
    if (d < closestDist) {
      closestDist = d;
      closestIdx = i;
    }
  }

  setActiveGradient(closestIdx);

  
  resizeBG();
  if (bgCtx) {
    const w = bgCanvas.clientWidth || stage.clientWidth;
    const h = bgCanvas.clientHeight || stage.clientHeight;
    bgCtx.fillStyle = '#f6f7f9';
    bgCtx.fillRect(0, 0, w, h);
  }

  
  await warmupCompositing();

  
  if ('requestIdleCallback' in window) {
    await new Promise((r) => requestIdleCallback(r, { timeout: 100 }));
  }

  
  startBG();
  await new Promise((r) => setTimeout(r, 100)); 

  
  const viewportWidth = window.innerWidth;
  const visibleCards = [];
  
  for (let i = 0; i < items.length; i++) {
    let pos = items[i].x - SCROLL_X;
    if (pos < -half) pos += TRACK;
    if (pos > half) pos -= TRACK;

    const screenX = pos;
    if (Math.abs(screenX) < viewportWidth * 0.6) {
      visibleCards.push({ item: items[i], screenX, index: i });
    }
  }

  
  visibleCards.sort((a, b) => a.screenX - b.screenX);

  
  if (loader) loader.classList.add('loader--hide');

  
  await animateEntry(visibleCards);

  
  isEntering = false;

  
  startCarousel();
}

init();