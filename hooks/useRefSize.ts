import { useEffect, useRef, useState } from "react";

export function useRefSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Follows the element itself, so it also catches full screen and layout changes, not only window resizes
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() =>
      setSize({ width: element.offsetWidth, height: element.offsetHeight }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
