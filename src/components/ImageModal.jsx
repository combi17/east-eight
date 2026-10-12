import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev, title }) => {
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const closeRef = useRef(null);
  const hasMultiple = images.length > 1;
  const handlers = useRef({ onClose, onNext, onPrev });
  handlers.current = { onClose, onNext, onPrev };

  useEffect(() => {
    setScale(1);
  }, [currentIndex]);

  useEffect(() => {
    const element = contentRef.current;
    const handleWheel = (event) => {
      event.preventDefault();
      const step = event.deltaY < 0 ? 0.1 : -0.1;
      setScale((prev) => Math.min(Math.max(prev + step, 1), 3));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      const { onClose: close, onNext: next, onPrev: prev } = handlers.current;
      if (event.key === 'Escape') close();
      if (hasMultiple && event.key === 'ArrowRight') next();
      if (hasMultiple && event.key === 'ArrowLeft') prev();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [hasMultiple]);

  const stop = (handler) => (event) => {
    event.stopPropagation();
    handler();
  };

  return (
    <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button ref={closeRef} type="button" className="lightbox-close-btn" aria-label="Închide galeria" onClick={stop(onClose)}>
        <X size={32} />
      </button>

      {hasMultiple && (
        <button type="button" className="lightbox-arrow prev" aria-label="Imaginea anterioară" onClick={stop(onPrev)}>
          <ArrowLeft size={32} />
        </button>
      )}

      <div className="lightbox-content" onClick={(event) => event.stopPropagation()} ref={contentRef}>
        <img
          src={images[currentIndex]}
          alt={`${title} - imagine ${currentIndex + 1}`}
          className="lightbox-image"
          onDoubleClick={() => setScale((prev) => (prev === 1 ? 2 : 1))}
          style={{
            transform: `scale(${scale})`,
            cursor: scale > 1 ? 'zoom-out' : 'zoom-in',
          }}
        />
      </div>

      {hasMultiple && (
        <button type="button" className="lightbox-arrow next" aria-label="Imaginea următoare" onClick={stop(onNext)}>
          <ArrowRight size={32} />
        </button>
      )}

      <div className="lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageModal;
