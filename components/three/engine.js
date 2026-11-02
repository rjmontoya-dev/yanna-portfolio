/**
 * Three.js engine: one renderer, one fixed full-screen canvas, two scenes.
 *
 *   1. Background: a sparse field of soft pink particles. It drifts slowly and
 *      leans gently toward the mouse. It is not tied to scrolling, so the page
 *      stays calm while you scroll.
 *   2. Tools orb: nine tool labels on a dotted sphere, drawn into the rectangle
 *      of #skills-orb-stage with scissor rendering, so there is still only one
 *      WebGL context. Hover, drag, or pick a chip to explore.
 *
 * The page talks to the orb through two window events:
 *   'va:skill-active' (engine → page)  { index | null }  pointer hover
 *   'va:skill-focus'  (page → engine)  { index | null }  chip hover / keyboard
 *
 * Colors come from the CSS variables in globals.css and update live when the
 * theme changes.
 */
import * as THREE from 'three';

const TAU = Math.PI * 2;
const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** Frame-rate independent smoothing factor. */
const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

function readPalette() {
  const root = document.documentElement;
  const s = getComputedStyle(root);
  const get = (name, fallback) => s.getPropertyValue(name).trim() || fallback;
  return {
    accent: get('--accent', '#c92d6e'),
    text: get('--text', '#2a1520'),
    muted: get('--text-muted', '#6e5560'),
    surface: get('--surface', '#ffffff'),
    border: get('--border', '#f1dde4'),
    onAccent: get('--on-accent', '#ffffff'),
    font: get('--font-body', 'system-ui, sans-serif'),
    dark: root.dataset.theme === 'dark',
  };
}

/** Soft round sprite used for particles. */
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Pill-shaped text label rendered to a texture (for the orb). */
function makeLabelTexture(text, { bg, fg, border, font }) {
  const fs = 40;
  const padX = 28;
  const padY = 18;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  g.font = `600 ${fs}px ${font}`;
  const w = Math.ceil(g.measureText(text).width + padX * 2);
  const h = fs + padY * 2;
  c.width = w + 4;
  c.height = h + 4;

  g.font = `600 ${fs}px ${font}`;
  const r = h / 2;
  g.beginPath();
  g.moveTo(2 + r, 2);
  g.arcTo(2 + w, 2, 2 + w, 2 + h, r);
  g.arcTo(2 + w, 2 + h, 2, 2 + h, r);
  g.arcTo(2, 2 + h, 2, 2, r);
  g.arcTo(2, 2, 2 + w, 2, r);
  g.closePath();
  g.fillStyle = bg;
  g.fill();
  g.lineWidth = 2;
  g.strokeStyle = border;
  g.stroke();

  g.fillStyle = fg;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, c.width / 2, c.height / 2 + 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: c.width / c.height };
}

/** Evenly distributed points on a sphere. */
function fibonacciSphere(n, radius, squashY = 1) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y * squashY, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return pts;
}

export async function createEngine({ canvas, stage, tools = [], lite = false, config }) {
  // Wait for web fonts so orb labels render in Inter, not a fallback.
  if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

  const speed = config.driftSpeed ?? 1;
  let palette = readPalette();

  // ---------------------------------------------------------------- renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !lite,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : config.maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  // -------------------------------------------------------- background scene
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  bgCamera.position.set(0, 0, 9);

  const dotTex = makeDotTexture();
  const pCount = lite ? config.particles.mobile : config.particles.desktop;
  const spread = config.particles.spread;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  const pIsAccent = new Uint8Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * spread;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.4 - 4;
    pIsAccent[i] = Math.random() < 0.55 ? 1 : 0;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: config.particles.size,
    map: dotTex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pGeo, pMat);
  bgScene.add(points);

  // ------------------------------------------------------------- tools orb
  const orbScene = new THREE.Scene();
  const orbCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  orbCamera.position.set(0, 0, 10);
  orbScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.8));
  const orbKey = new THREE.DirectionalLight(0xffffff, 1.6);
  orbKey.position.set(3, 4, 6);
  orbScene.add(orbKey);

  const orb = new THREE.Group();
  orbScene.add(orb);
  const R = config.orb.radius;

  // A soft dotted shell instead of a hard-edged wireframe.
  const shellGeo = new THREE.BufferGeometry().setFromPoints(fibonacciSphere(lite ? 160 : 320, R * 0.62));
  const shellMat = new THREE.PointsMaterial({ size: 0.05, map: dotTex, transparent: true, depthWrite: false });
  const shell = new THREE.Points(shellGeo, shellMat);
  // A small smooth glowing core.
  const coreMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.2, 48, 24), coreMat);
  orb.add(shell, core);

  // Two faint orbit rings.
  const ringPts = [];
  for (let i = 0; i <= 128; i++) ringPts.push(new THREE.Vector3(Math.cos((i / 128) * TAU) * R, 0, Math.sin((i / 128) * TAU) * R));
  const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
  const ringMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22 });
  const ringA = new THREE.Line(ringGeo, ringMat);
  const ringB = new THREE.Line(ringGeo, ringMat);
  ringA.rotation.x = 0.35;
  ringB.rotation.set(1.2, 0, 0.6);
  orb.add(ringA, ringB);

  const nodeDotGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const nodes = fibonacciSphere(tools.length, R, 0.85).map((pos, i) => {
    const dotMat = new THREE.MeshBasicMaterial({ transparent: true });
    const dot = new THREE.Mesh(nodeDotGeo, dotMat);
    dot.position.copy(pos);

    const spokeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.12 });
    const spoke = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), pos]), spokeMat);

    const labelMat = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false });
    const label = new THREE.Sprite(labelMat);
    label.position.copy(pos).multiplyScalar(1.13);
    label.userData.index = i;

    orb.add(spoke, dot, label);
    return { pos, dot, dotMat, spokeMat, label, labelMat, textures: null, aspect: 1, scale: 1 };
  });
  const labelSprites = nodes.map((n) => n.label);
  const LABEL_H = 0.36;

  function buildLabels() {
    nodes.forEach((n, i) => {
      n.textures?.normal.dispose();
      n.textures?.active.dispose();
      const normal = makeLabelTexture(tools[i].name, {
        bg: palette.surface,
        fg: palette.text,
        border: palette.border,
        font: palette.font,
      });
      const active = makeLabelTexture(tools[i].name, {
        bg: palette.accent,
        fg: palette.onAccent,
        border: palette.accent,
        font: palette.font,
      });
      n.textures = { normal: normal.tex, active: active.tex };
      n.aspect = normal.aspect;
      n.labelMat.map = normal.tex;
      n.labelMat.needsUpdate = true;
    });
  }

  // ----------------------------------------------------------- theme colors
  function applyPalette() {
    palette = readPalette();
    const muted = new THREE.Color(palette.muted);
    const accent = new THREE.Color(palette.accent);
    for (let i = 0; i < pCount; i++) {
      const c = pIsAccent[i] ? accent : muted;
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }
    pGeo.attributes.color.needsUpdate = true;
    pMat.opacity = palette.dark ? 0.6 : 0.45;

    shellMat.color.set(palette.accent);
    shellMat.opacity = palette.dark ? 0.55 : 0.45;
    ringMat.color.set(palette.accent);
    coreMat.color.set(palette.accent);
    coreMat.emissive.set(palette.accent).multiplyScalar(palette.dark ? 0.45 : 0.15);
    nodes.forEach((n) => {
      n.dotMat.color.set(palette.accent);
      n.spokeMat.color.set(palette.accent);
    });
    buildLabels();
  }
  applyPalette();

  const themeObserver = new MutationObserver(applyPalette);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ------------------------------------------------------------------ input
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointerMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Orb interaction
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let activeIndex = null; // highlighted node
  let hoverIndex = null; // node under the pointer
  let focusTargetY = null; // rotate a node to the front when picked from the list
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let spinVel = 0;
  let tiltTarget = 0.15;

  const emitActive = (index) => window.dispatchEvent(new CustomEvent('va:skill-active', { detail: { index } }));

  function pickNode(e) {
    const rect = stage.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, orbCamera);
    const hit = raycaster.intersectObjects(labelSprites, false)[0];
    return hit ? hit.object.userData.index : null;
  }

  const onStageMove = (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      orb.rotation.y += dx * 0.008;
      spinVel = dx * 0.4;
      tiltTarget = clamp(tiltTarget + dy * 0.004, -0.6, 0.6);
      return;
    }
    const idx = pickNode(e);
    stage.classList.toggle('is-pointing', idx !== null);
    if (idx !== hoverIndex) {
      hoverIndex = idx;
      activeIndex = idx;
      focusTargetY = null;
      emitActive(idx);
    }
  };
  const onStageDown = (e) => {
    if (e.pointerType === 'touch') {
      // Tap selects on touch; vertical swipes still scroll the page.
      const idx = pickNode(e);
      if (idx !== null) {
        activeIndex = idx;
        emitActive(idx);
      }
      return;
    }
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    focusTargetY = null;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(e.pointerId);
  };
  const onStageUp = (e) => {
    dragging = false;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(e.pointerId);
  };
  const onStageLeave = () => {
    if (dragging) return;
    hoverIndex = null;
    activeIndex = null;
    stage.classList.remove('is-pointing');
    emitActive(null);
  };
  const onExternalFocus = (e) => {
    const idx = e.detail?.index ?? null;
    activeIndex = idx;
    if (idx === null) {
      focusTargetY = null;
      return;
    }
    // Rotate the orb so the chosen node faces the camera (shortest path).
    const p = nodes[idx].pos;
    const want = -Math.atan2(p.x, p.z);
    const cur = orb.rotation.y;
    focusTargetY = cur + ((((want - cur + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
  };

  if (stage) {
    stage.addEventListener('pointermove', onStageMove);
    stage.addEventListener('pointerdown', onStageDown);
    stage.addEventListener('pointerup', onStageUp);
    stage.addEventListener('pointercancel', onStageUp);
    stage.addEventListener('pointerleave', onStageLeave);
  }
  window.addEventListener('va:skill-focus', onExternalFocus);

  // ------------------------------------------------------------------ sizing
  let width = 0;
  let height = 0;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    bgCamera.aspect = w / h;
    bgCamera.updateProjectionMatrix();
  }

  // ------------------------------------------------------------------- loop
  const clock = new THREE.Clock();
  const worldPos = new THREE.Vector3();
  let raf = 0;
  let running = false;

  function renderBackground(t, dt) {
    const k = damp(2, dt);
    mouse.sx += (mouse.x - mouse.sx) * k;
    mouse.sy += (mouse.y - mouse.sy) * k;
    const par = config.parallax;

    bgCamera.position.x = mouse.sx * 0.5 * par;
    bgCamera.position.y = mouse.sy * 0.3 * par;
    bgCamera.lookAt(0, 0, 0);
    points.rotation.y = t * 0.01 * speed;
    points.rotation.x = Math.sin(t * 0.05 * speed) * 0.03;

    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, width, height);
    renderer.render(bgScene, bgCamera);
  }

  function renderOrb(dt) {
    if (!stage || !config.orb.enabled) return;
    const rect = stage.getBoundingClientRect();
    // Skip when hidden (mobile / fallback) or scrolled out of view.
    if (rect.width === 0 || rect.bottom < 0 || rect.top > height) return;

    if (dragging) {
      // rotation handled in pointermove
    } else if (focusTargetY !== null) {
      orb.rotation.y += (focusTargetY - orb.rotation.y) * damp(5, dt);
    } else if (activeIndex === null) {
      spinVel *= Math.exp(-3 * dt);
      orb.rotation.y += (config.orb.autoRotateSpeed * speed + spinVel * 0.05) * dt;
    }
    orb.rotation.x += (tiltTarget - orb.rotation.x) * damp(4, dt);
    shell.rotation.y -= dt * 0.05;

    nodes.forEach((n, i) => {
      const isActive = activeIndex === i;
      n.label.getWorldPosition(worldPos);
      // Nodes behind the orb fade back for depth.
      const depth = clamp((worldPos.z / (R * 1.13) + 1) / 2, 0, 1);
      const base = lerp(0.3, 1, depth);
      const dim = activeIndex !== null && !isActive ? 0.35 : 1;
      n.labelMat.opacity = isActive ? 1 : base * dim;
      const map = isActive ? n.textures.active : n.textures.normal;
      if (n.labelMat.map !== map) {
        n.labelMat.map = map;
        n.labelMat.needsUpdate = true;
      }
      n.scale += ((isActive ? 1.2 : 1) - n.scale) * damp(10, dt);
      n.label.scale.set(LABEL_H * n.aspect * n.scale, LABEL_H * n.scale, 1);
      n.label.renderOrder = isActive ? 10 : Math.round(depth * 5);
      n.dot.scale.setScalar(isActive ? 2 : 1);
      n.dotMat.opacity = base;
      n.spokeMat.opacity = isActive ? 0.6 : 0.12;
    });

    orbCamera.aspect = rect.width / rect.height;
    orbCamera.updateProjectionMatrix();
    // The canvas covers the viewport, so DOM rect coords map 1:1 (y flipped).
    const x = rect.left;
    const y = height - rect.bottom;
    renderer.setScissorTest(true);
    renderer.setScissor(x, y, rect.width, rect.height);
    renderer.setViewport(x, y, rect.width, rect.height);
    renderer.clearDepth();
    renderer.render(orbScene, orbCamera);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    resize();
    renderer.setScissorTest(false);
    renderer.clear();
    renderBackground(t, dt);
    renderOrb(dt);
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta(); // swallow the time spent paused
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Pause when the tab is hidden.
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  start();

  return {
    destroy() {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('va:skill-focus', onExternalFocus);
      if (stage) {
        stage.removeEventListener('pointermove', onStageMove);
        stage.removeEventListener('pointerdown', onStageDown);
        stage.removeEventListener('pointerup', onStageUp);
        stage.removeEventListener('pointercancel', onStageUp);
        stage.removeEventListener('pointerleave', onStageLeave);
      }
      themeObserver.disconnect();
      const dispose = (obj) => {
        obj.traverse((o) => {
          o.geometry?.dispose();
          o.material?.dispose();
        });
      };
      dispose(bgScene);
      dispose(orbScene);
      nodes.forEach((n) => {
        n.textures?.normal.dispose();
        n.textures?.active.dispose();
      });
      dotTex.dispose();
      renderer.dispose();
    },
  };
}
