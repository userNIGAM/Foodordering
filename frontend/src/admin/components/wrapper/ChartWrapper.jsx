import { ResponsiveContainer } from "recharts";
import { useRef, useState, useEffect } from "react";

const ChartWrapper = ({ children }) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setReady(true);
        }
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="h-[220px] sm:h-[260px] lg:h-96 w-full max-w-full min-w-0"
    >
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartWrapper;
