"use client";

import { useEffect, useRef } from "react";

interface Options {
  selector: string;
  stagger?: number;
  threshold?: number;
  finalTransform?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>({
  selector,
  stagger = 100,
  threshold = 0.1,
  finalTransform = "translateY(0)",
}: Options) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(selector).forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = finalTransform;
          }, i * stagger);
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [selector, stagger, threshold, finalTransform]);

  return ref;
}
