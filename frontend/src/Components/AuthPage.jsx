import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyEmailForm from "./VerifyEmailForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import AuthHeader from "./AuthHeader";
import AuthSidebar from "./AuthSidebar";
import GradientBackdrop from "./GradientBackdrop";

const AuthPage = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");

  const handleModeChange = (newMode, email = "") => {
    setMode(newMode);
    if (email) setPendingEmail(email);
  };

  const renderForm = () => {
    switch (mode) {
      case "signup":
        return <SignupForm onModeChange={handleModeChange} />;
      case "verify":
        return (
          <VerifyEmailForm
            email={pendingEmail}
            onModeChange={handleModeChange}
          />
        );
      case "forgot":
        return <ForgotPasswordForm onModeChange={handleModeChange} />;
      case "reset":
        return (
          <ResetPasswordForm
            email={pendingEmail}
            onModeChange={handleModeChange}
          />
        );
      default:
        return (
          <LoginForm
            onModeChange={handleModeChange}
            onLoginSuccess={onLoginSuccess}
          />
        );
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-10">
      <GradientBackdrop />

      <div className="mx-auto w-full max-w-6xl">
        <AuthHeader />

        <div className="grid items-start gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {renderForm()}
          </motion.div>

          <AuthSidebar />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
