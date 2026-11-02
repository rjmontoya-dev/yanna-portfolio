'use client';

import { useEffect, useRef, useState } from 'react';
import { SCENE_CONFIG } from '@/lib/scene-config';
import { orbTools } from '@/lib/content';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/**
 * The single shared 3D canvas. Three.js is lazy-loaded (separate chunk) once
 * the browser is idle, so it never blocks first paint. Falls back to a static
 * CSS background for reduced-motion users, no-WebGL browsers, and (optionally)
 * phones.
 */
export default function Scene() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('pending'); // 'pending' | '3d' | 'static'

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 767px)').matches;

    if (
      !SCENE_CONFIG.enabled ||
      reduceMotion ||
      (small && SCENE_CONFIG.mobileMode === 'static') ||
      !hasWebGL()
    ) {
      setMode('static');
      return;
    }

    let engine;
    let cancelled = false;

    const boot = async () => {
      try {
        const { createEngine } = await import('./three/engine');
        if (cancelled) return;
        const instance = await createEngine({
          canvas: canvasRef.current,
          stage: document.getElementById('skills-orb-stage'),
          tools: orbTools,
          lite: small,
          config: SCENE_CONFIG,
        });
        if (cancelled) {
          instance.destroy();
          return;
        }
        engine = instance;
        if (SCENE_CONFIG.orb.enabled) document.documentElement.dataset.orb = 'on'; // reveals the orb stage via CSS
        setMode('3d');
      } catch (err) {
        console.warn('3D scene disabled:', err);
        setMode('static');
      }
    };

    // Lazy-load after the page settles.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(boot, { timeout: 1500 })
      : window.setTimeout(boot, 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      engine?.destroy();
      delete document.documentElement.dataset.orb;
    };
  }, []);

  return (
    <div className="scene" data-mode={mode} aria-hidden="true">
      <div className="scene__fallback" />
      <canvas ref={canvasRef} className="scene__canvas" />
    </div>
  );
}
