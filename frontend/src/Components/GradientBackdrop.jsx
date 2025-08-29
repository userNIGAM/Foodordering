import React from "react";

const GradientBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute left-1/2 top-[-10%] -translate-x-1/2">
      <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-rose-400 blur-3xl opacity-20" />
    </div>
  </div>
);

export default GradientBackdrop;
