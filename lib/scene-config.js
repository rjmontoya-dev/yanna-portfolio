/**
 * 3D scene settings. Tweak these to tune the Three.js layer.
 * Colors are NOT set here. The scene reads --accent, --text-muted, etc.
 * from the CSS variables in app/globals.css, so it always matches the active
 * light/dark theme.
 */
export const SCENE_CONFIG = {
  enabled: true, // false = always use the static CSS background

  // On phones (< 768px): 'lite' renders a lighter 3D background,
  // 'static' skips WebGL entirely and shows the CSS fallback.
  mobileMode: 'lite',

  maxPixelRatio: 2, // cap for crisp-but-cheap rendering on retina screens

  particles: {
    desktop: 700,
    mobile: 250,
    size: 0.06,
    spread: 28, // how wide the particle field is (world units)
  },

  parallax: 1, // mouse parallax strength (0 = off)
  driftSpeed: 1, // global animation speed multiplier

  orb: {
    enabled: true, // false = show only the tool chips, no 3D orb
    radius: 1.8, // radius of the tools orb
    autoRotateSpeed: 0.18, // radians per second
  },
};
