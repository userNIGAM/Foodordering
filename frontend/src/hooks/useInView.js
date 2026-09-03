// useInView.js
import { useState, useEffect, useRef } from "react";

export default function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // 👈 keeps toggling
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
// useInViewOnce.js
// import { useState, useEffect, useRef } from "react";

// export default function useInViewOnce(threshold = 0.2) {
//   const ref = useRef(null);
//   const [hasAppeared, setHasAppeared] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setHasAppeared(true); // 👈 only sets once
//           observer.disconnect(); // 👈 stop observing after first appearance
//         }
//       },
//       { threshold }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold]);

//   return [ref, hasAppeared];
// }
