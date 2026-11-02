'use client';

import { useEffect, useState } from 'react';

/**
 * DOM half of the tools orb. The 3D orb itself is drawn by the shared
 * engine into #skills-orb-stage. The chip list is the accessible (keyboard /
 * screen reader / no-WebGL) way to explore the same tools, and stays in sync
 * with the orb via window events.
 */
export default function ToolsOrb({ tools }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onActive = (e) => setActive(e.detail?.index ?? null);
    window.addEventListener('va:skill-active', onActive);
    return () => window.removeEventListener('va:skill-active', onActive);
  }, []);

  const select = (index) => {
    setActive(index);
    window.dispatchEvent(new CustomEvent('va:skill-focus', { detail: { index } }));
  };

  const current = active === null ? null : tools[active];

  return (
    <div className="tools-orb">
      <div id="skills-orb-stage" className="tools-orb__stage" aria-hidden="true">
        <span className="tools-orb__hint">Drag to rotate · hover a tool</span>
      </div>

      <div>
        <div className="tools-orb__detail card" aria-live="polite">
          {current ? (
            <>
              <p className="tools-orb__label">How I use it</p>
              <h3>{current.name}</h3>
              <p>{current.description}</p>
            </>
          ) : (
            <>
              <p className="tools-orb__label">My daily toolkit</p>
              <h3>Nine tools, one smooth workflow</h3>
              <p>Hover the orb or pick a tool below to see how I put it to work for clients.</p>
            </>
          )}
        </div>

        <ul className="chip-list" aria-label="Tools">
          {tools.map((t, i) => (
            <li key={t.name}>
              <button
                type="button"
                className="chip"
                aria-pressed={active === i}
                onMouseEnter={() => select(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
              >
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
