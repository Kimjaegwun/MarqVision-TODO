import { useEffect, useRef, useState } from "react";

const useIntersection = ({
  threshold,
  onIntersect,
}: {
  threshold: number;
  onIntersect?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          onIntersect?.();
        }
      },
      {
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, onIntersect]);

  return { ref, isIntersecting };
};

export default useIntersection;
