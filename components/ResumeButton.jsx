'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import PdfPages from './PdfPages';

/**
 * "View Resume" button that opens the PDF in a pop-up instead of a new tab.
 * Uses the native <dialog> element, so focus trapping and Esc-to-close come
 * for free. Without JavaScript the link still opens the PDF directly.
 */
export default function ResumeButton({ url, name }) {
  const dialogRef = useRef(null);
  const [loaded, setLoaded] = useState(false); // only fetch the PDF once opened

  const open = (e) => {
    e.preventDefault();
    setLoaded(true);
    dialogRef.current?.showModal();
    document.documentElement.classList.add('modal-open');
  };

  const close = () => dialogRef.current?.close();

  // Start downloading PDF.js and the resume on hover/focus so the pop-up
  // opens with little or no wait.
  const warmed = useRef(false);
  const warmUp = () => {
    if (warmed.current) return;
    warmed.current = true;
    import('pdfjs-dist').catch(() => {});
    fetch(url).catch(() => {});
    fetch('/pdf.worker.min.mjs').catch(() => {});
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const onClose = () => document.documentElement.classList.remove('modal-open');
    // Clicking the dimmed backdrop (outside the panel) closes the pop-up.
    const onClick = (e) => e.target === dialog && dialog.close();
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <a
        href={url}
        className="btn btn--ghost"
        onClick={open}
        onPointerEnter={warmUp}
        onFocus={warmUp}
        aria-haspopup="dialog"
      >
        <Icon name="file" size={18} /> View Resume
      </a>

      <dialog ref={dialogRef} className="resume-modal" aria-labelledby="resume-title">
        <div className="resume-modal__panel">
          <header className="resume-modal__head">
            <div>
              <p className="resume-modal__eyebrow">Resume</p>
              <h2 id="resume-title">{name}</h2>
            </div>
            <div className="resume-modal__actions">
              <a href={url} download className="btn btn--primary btn--sm">
                <Icon name="download" size={16} /> Download
              </a>
              <a href={url} target="_blank" rel="noopener" className="icon-btn" aria-label="Open in new tab" title="Open in new tab">
                <Icon name="external" size={17} />
              </a>
              <button type="button" className="icon-btn" onClick={close} aria-label="Close resume">
                <Icon name="close" size={17} />
              </button>
            </div>
          </header>

          <div className="resume-modal__body">{loaded && <PdfPages url={url} title={`${name} resume`} />}</div>
        </div>
      </dialog>
    </>
  );
}
