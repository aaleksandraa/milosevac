import { useEffect, useState } from "react";

/**
 * Vraća `true` tek nakon prvog paint-a (requestIdleCallback / fallback timeout).
 * Koristi se za odgađanje skupljih dijelova UI-a (npr. detaljan SVG cover)
 * dok LCP element ne postane vidljiv.
 */
export function useDeferredMount(timeoutMs = 1500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    let timeoutId: number | null = null;
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
    } else {
      timeoutId = window.setTimeout(() => setReady(true), 200);
    }

    return () => {
      if (idleId !== null && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [timeoutMs]);

  return ready;
}
