import { useEffect } from 'react';
import gsap from 'gsap';

export function useGsapHero(containerRef: React.RefObject<any>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, y: -16, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
      .fromTo(
        '.gsap-hero-title',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.35'
      )
      .fromTo(
        '.gsap-hero-desc',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.45'
      )
      .fromTo(
        '.gsap-hero-cta',
        { opacity: 0, y: 14, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.4'
      )
      .fromTo(
        '.gsap-hero-showcase',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

/**
 * Reveal universal à prova de falhas:
 * Usa IntersectionObserver para disparar animação fluida no scroll
 * sem travar o elemento em opacity: 0 caso o scroller seja interno.
 */
export function useGsapScrollReveal(selector: string, _containerRef?: React.RefObject<any>) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements || elements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback seguro: garante visibilidade
      elements.forEach((el) => {
        el.style.opacity = '1';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selector]);
}

export function useGsapFloatingElements(selector: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(selector, {
        y: -6,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.3,
          from: 'random',
        },
      });
    });

    return () => ctx.revert();
  }, [selector]);
}
