import React from "react";

const Divider = () => (
  <div className="relative my-6 flex items-center">
    <div className="h-px flex-1 bg-slate-200" />
    <span className="mx-3 text-xs uppercase tracking-wider text-slate-400">
      or
    </span>
    <div className="h-px flex-1 bg-slate-200" />
  </div>
);

export default Divider;
