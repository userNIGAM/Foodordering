import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserIcon,
  UserPlus,
  Loader2,
} from "lucide-react";
import Input from "./Input";
import SocialButtons from "./SocialButtons";
import Divider from "./Divider";
import Card from "./Card";
import api from "../../services/api";

const SignupForm = ({ onModeChange }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const { data } = await api.post("api/auth/register", {
        name,
        email,
        password,
      });
      toast.success("We sent a verification OTP to your email");
      onModeChange("verify", email);
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
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Create account
          </h2>
          <p className="text-sm text-slate-500">Sign up to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Full name
          </label>
          <Input
            icon={UserIcon}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            rightIcon={
              showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )
            }
            onRightIconClick={() => setShowPassword((s) => !s)}
          />
          <div className="mt-1 text-xs text-slate-500">
            <span>At least 6 characters</span>
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
            <UserPlus className="h-5 w-5" />
          )}
          Create account
        </motion.button>

        <Divider />

        <SocialButtons />

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </button>
        </p>
      </form>
    </Card>
  );
};

export default SignupForm;
