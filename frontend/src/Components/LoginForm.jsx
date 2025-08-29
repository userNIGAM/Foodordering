import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import Input from "./Input";
import SocialButtons from "./SocialButtons";
import Divider from "./Divider";
import Card from "./Card";
import api from "../services/api";

const LoginForm = ({ onModeChange, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setLoading(true);
      const { data } = await api.post("api/auth/login", { email, password });
      toast.success("Logged in successfully");
      if (onLoginSuccess) onLoginSuccess(data?.user);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 flex items-center gap-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/90 text-white shadow-md">
          <LogIn className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Welcome back</h2>
          <p className="text-sm text-slate-500">Log in to continue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Email
          </label>
          <Input
            icon={Mail}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Password
          </label>
          <Input
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            rightIcon={
              showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )
            }
            onRightIconClick={() => setShowPassword((s) => !s)}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>At least 6 characters</span>
            <button
              type="button"
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
              onClick={() => onModeChange("forgot")}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Log in
        </motion.button>

        <Divider />

        <SocialButtons />

        <p className="mt-4 text-center text-sm text-slate-600">
          New here?{" "}
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Create an account
          </button>
        </p>
      </form>
    </Card>
  );
};

export default LoginForm;
