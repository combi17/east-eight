import { useCallback, useRef } from 'react';

const useScrollAnimation = (animationClass = 'animate__fadeInUp', threshold = 0.25) => {
  const observerRef = useRef(null);

  return useCallback(
    (node) => {
      observerRef.current?.disconnect();
      if (!node) return;

      node.classList.add('pre-animate');
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          node.classList.remove('pre-animate');
          node.classList.add('animate__animated', animationClass);
          observer.disconnect();
        },
        { threshold, rootMargin: '50px' },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [animationClass, threshold],
  );
};

export default useScrollAnimation;
