import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyEmailForm from "./VerifyEmailForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import AuthHeader from "./AuthHeader";
import AuthSidebar from "./AuthSidebar";
import GradientBackdrop from "./GradientBackdrop";
import { AuthContext } from "../../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const { user } = useContext(AuthContext); // Get user from context
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleModeChange = (newMode, email = "") => {
    setMode(newMode);
    if (email) setPendingEmail(email);
  };

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    navigate("/"); // redirect after login
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
            onLoginSuccess={handleLoginSuccess}
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
