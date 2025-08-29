import React from "react";
import { motion } from "framer-motion";

const AuthHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 }}
    className="mb-10 text-center"
  >
    <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
      Build. Launch.{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
        Authenticate.
      </span>
    </h1>
    <p className="mt-2 text-slate-500">
      Modern, production-grade auth UI connected to your Node/Express backend.
    </p>
  </motion.div>
);

export default AuthHeader;
