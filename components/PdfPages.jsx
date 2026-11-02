'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Draws every page of a PDF onto canvases with PDF.js, so the resume shows up
 * the same way on every browser, phones included (most mobile browsers can't
 * embed PDFs in an iframe). PDF.js is only downloaded when this mounts.
 * The worker file is copied into /public by the `postinstall` script.
 */
export default function PdfPages({ url, title }) {
  const ref = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;
    let doc;

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        doc = await pdfjs.getDocument(url).promise;
        const box = ref.current;
        const width = box.clientWidth;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let n = 1; n <= doc.numPages; n++) {
          if (cancelled) return;
          const page = await doc.getPage(n);
          const scale = (width / page.getViewport({ scale: 1 }).width) * dpr;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = 'pdf-page';
          canvas.setAttribute('role', 'img');
          canvas.setAttribute('aria-label', `${title}, page ${n} of ${doc.numPages}`);
          box.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          if (n === 1 && !cancelled) setStatus('ready');
        }
      } catch (err) {
        console.warn('Could not render resume:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      doc?.destroy();
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [url, title]);

  return (
    <>
      {status === 'loading' && <p className="pdf-status">Loading resume…</p>}
      {status === 'error' && (
        <p className="pdf-status">
          The resume couldn&apos;t load here.{' '}
          <a href={url} target="_blank" rel="noopener">
            Open it in a new tab
          </a>
          .
        </p>
      )}
      <div ref={ref} className="pdf-pages" />
    </>
  );
}
