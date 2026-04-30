import { useRef, useCallback } from "react";

/**
 * Applies a subtle 3-D perspective tilt to a card element based on mouse position.
 * The tilt resets smoothly when the cursor leaves.
 */
export function useCardTilt(maxDeg = 7) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      // Normalise cursor to -0.5 … +0.5 relative to the card centre
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;
      el.style.transition = "none";
      el.style.transform  = `perspective(900px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg * 2}deg) scale3d(1.015,1.015,1.015)`;
    },
    [maxDeg],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s ease-out";
    el.style.transform  = "";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
