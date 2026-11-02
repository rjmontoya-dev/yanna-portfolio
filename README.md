# Yanaleen Peregrino · Virtual Assistant Portfolio

A one-page portfolio built with Next.js, Three.js (subtle particle background and interactive tools orb) and GSAP (typing effect and scroll animations).

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Customize

- **Text, contact details, roles, tasks:** `lib/content.js`
- **Colors and fonts:** the CSS variables at the top of `app/globals.css` (the 3D scene reads the same colors)
- **3D settings:** `lib/scene-config.js` (`orb.enabled: false` hides the tools orb, `enabled: false` turns off all 3D)
- **Animations:** `components/Motion.jsx`
- **Resume:** replace `public/resume.pdf`. The "View Resume" pop-up renders it with PDF.js.
