'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin);

/**
 * Every GSAP animation on the page, driven by data attributes in the markup:
 *
 *   data-hero-name   hero name, letters rise in
 *   data-typed       typing effect that cycles through data-words (JSON)
 *   data-hero-in     hero items that fade up during the intro
 *   data-task        task board rows that get checked off one by one
 *   data-badge       badge that pops in after the tasks
 *   data-split       headings whose words slide up when scrolled into view
 *   data-reveal      single elements that fade up on scroll
 *   data-stagger     containers whose children fade up one after another
 *   data-count       numbers that count up (data-suffix is optional)
 *   data-bar         progress bars that grow to data-bar (0–1)
 *   data-line        timeline line drawn as you scroll
 *   data-progress    reading progress bar at the top of the page
 *
 * With prefers-reduced-motion, none of this runs and content stays static.
 */
export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    let disposed = false;

    // Split text only once web fonts are in, so letters are measured correctly.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (disposed) return;
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = (sel) => gsap.utils.toArray(sel);
        const ease = 'power3.out';

        // -------------------------------------------------------------- hero
        const intro = gsap.timeline({ defaults: { ease }, delay: 0.15 });

        q('[data-hero-name]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words,chars', mask: 'words' });
          gsap.set(el, { autoAlpha: 1 });
          intro.from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.025 }, 0);
        });

        intro.fromTo(
          q('[data-hero-in]'),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
          0.35,
        );

        // Typing effect: type the first word, then delete / retype the rest.
        q('[data-typed]').forEach((el) => {
          const words = JSON.parse(el.dataset.words || '[]');
          if (!words.length) return;
          el.textContent = '';
          const typeIn = (w) => ({ text: { value: w }, duration: w.length * 0.055, ease: 'none' });
          const tl = gsap.timeline({ repeat: -1 });
          words.forEach((w, i) => {
            if (i > 0) tl.to(el, { text: { value: '' }, duration: words[i - 1].length * 0.025, ease: 'none' });
            tl.to(el, typeIn(w)).to({}, { duration: 2.2 });
          });
          tl.to(el, { text: { value: '' }, duration: words[words.length - 1].length * 0.025, ease: 'none' });
          intro.add(tl, 0.9);
        });

        // Task board: rows appear and get checked off, then the badge pops in.
        const tasks = q('[data-task]');
        if (tasks.length) {
          tasks.forEach((t) => t.classList.remove('is-done'));
          const board = gsap.timeline({ delay: 1.1 });
          tasks.forEach((t) => {
            board
              .fromTo(t, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.5, ease })
              .add(() => t.classList.add('is-done'), '+=0.35');
          });
          board.fromTo(
            q('[data-badge]'),
            { autoAlpha: 0, scale: 0.85, y: 8 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' },
            '+=0.2',
          );
        }

        // ---------------------------------------------------- scroll reveals
        q('[data-split]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words', mask: 'words' });
          gsap.set(el, { autoAlpha: 1 });
          gsap.from(split.words, {
            yPercent: 110,
            duration: 0.9,
            ease,
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        q('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
          );
        });

        q('[data-stagger]').forEach((el) => {
          gsap.fromTo(
            el.children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease,
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
          );
        });

        // ------------------------------------------------------ numbers/bars
        q('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const state = { v: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(state, {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => (el.textContent = `${Math.round(state.v)}${suffix}`),
          });
        });

        q('[data-bar]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: Number(el.dataset.bar),
              duration: 1.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        });

        // ---------------------------------------------------------- timeline
        q('[data-line]').forEach((line) => {
          const list = line.parentElement;
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 65%', scrub: 0.6 },
            },
          );
          list.querySelectorAll('.timeline__item').forEach((item) => {
            ScrollTrigger.create({
              trigger: item,
              start: 'top 68%',
              // Dot fills when reached and stays filled until you scroll back up.
              onEnter: () => item.classList.add('is-active'),
              onLeaveBack: () => item.classList.remove('is-active'),
            });
          });
        });

        // ---------------------------------------------------- page progress
        q('[data-progress]').forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
          );
        });
      });
    });

    return () => {
      disposed = true;
      mm.revert();
    };
  }, []);

  return null;
}
