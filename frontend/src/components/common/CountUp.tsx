import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  decimals?: number;
  durationMs?: number;
  /** Usa vírgula decimal (pt-BR) em vez de ponto. */
  comma?: boolean;
}

/** Anima um número de 0 até `value` na montagem — micro-interação para destaques. */
export function CountUp({ value, decimals = 0, durationMs = 650, comma = false }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, durationMs]);

  const text = display.toFixed(decimals);
  return <>{comma ? text.replace('.', ',') : text}</>;
}
