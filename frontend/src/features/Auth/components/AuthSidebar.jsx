import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const AuthSidebar = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 }}
    className="order-first mx-auto max-w-xl text-center md:order-none md:text-left"
  >
    {/* <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
      <ShieldCheck className="h-4 w-4 text-emerald-600" />
      Secure by design
    </div>
    <h3 className="mt-4 text-2xl font-semibold text-slate-800 md:text-3xl">
      Beautiful auth that actually works
    </h3>
    <p className="mt-2 max-w-md text-slate-600">
      This form is wired to your Express API: register sends a verification OTP,
      and login sets an HttpOnly cookie. Toasts show errors and success.
      Animated with Framer Motion.
    </p>
    <ul className="mt-4 space-y-2 text-slate-600">
      <li className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Email +
        password with validation
      </li>
      <li className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> OTP
        verification for email and password reset
      </li>
      <li className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Fancy but
        accessible UI
      </li>
      <li className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> OAuth
        buttons for show
      </li>
    </ul> */}
  </motion.div>
);

export default AuthSidebar;
