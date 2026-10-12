import { useCallback, useRef } from 'react';

const useScrollAnimation = (delay = 0) => {
  const observerRef = useRef(null);

  return useCallback(
    (node) => {
      observerRef.current?.disconnect();
      if (!node) return;

      node.classList.add('reveal');
      node.style.setProperty('--reveal-delay', `${delay}ms`);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          node.classList.add('is-visible');
          observer.disconnect();
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [delay],
  );
};

export default useScrollAnimation;
