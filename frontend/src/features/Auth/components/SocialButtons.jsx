import React from "react";
import { Github } from "lucide-react";

// Inline SVGs for Google & Facebook brand marks
const GoogleIcon = (props) => (
  <svg viewBox="0 0 533.5 544.3" aria-hidden="true" {...props}>
    <path
      fill="#4285f4"
      d="M533.5 278.4c0-18.6-1.5-37-4.6-54.8H272v103.8h147c-6.3 34-25.1 62.7-53.5 81.9v67h86.5c50.6-46.6 81.5-115.3 81.5-198z"
    />
    <path
      fill="#34a853"
      d="M272 544.3c72.9 0 134.2-24.1 178.9-65.5l-86.5-67c-24 16.1-54.8 25.6-92.4 25.6-71 0-131.2-47.9-152.7-112.3H30.5v70.6C74.9 486 167.9 544.3 272 544.3z"
    />
    <path
      fill="#fbbc04"
      d="M119.3 325.1c-10.4-30.9-10.4-64.1 0-95l.1-70.6H30.5c-42.2 84.4-42.2 151.7 0 236.1l88.8-70.5z"
    />
    <path
      fill="#ea4335"
      d="M272 106.1c39.6-.6 77.8 14.4 106.7 42.1l79.6-79.6C406 24.9 342.5-.3 272 0 167.9 0 74.9 58.2 30.5 149.6l88.8 70.6C140.7 154 201 106.1 272 106.1z"
    />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03H7.9v-2.9h2.55V9.41c0-2.52 1.5-3.91 3.8-3.91 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34V22c4.78-.78 8.44-4.93 8.44-9.93z"
    />
  </svg>
);

const SocialButtons = () => (
  <div className="grid grid-cols-3 gap-3">
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white shadow-sm"
    >
      <GoogleIcon className="h-5 w-5" />
      Google
    </button>
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white shadow-sm"
    >
      <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
      Facebook
    </button>
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white shadow-sm"
    >
      <Github className="h-5 w-5" />
      GitHub
    </button>
  </div>
);

export default SocialButtons;
