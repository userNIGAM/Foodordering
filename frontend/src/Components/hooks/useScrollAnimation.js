// hooks/useScrollAnimationsList.js
import { useEffect, useState, useRef } from "react";

const useScrollAnimationsList = (itemsLength, options = {}) => {
  const itemRefs = useRef([]);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = itemRefs.current.indexOf(entry.target);
          if (index !== -1) {
            setVisibleItems((prev) => {
              if (entry.isIntersecting && !prev.includes(index)) {
                return [...prev, index]; // add if visible
              } else if (!entry.isIntersecting && prev.includes(index)) {
                return prev.filter((i) => i !== index); // remove if hidden
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2, ...options }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [itemsLength, options]);

  return [itemRefs, visibleItems];
};

export default useScrollAnimationsList;
