import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import Input from "./Input";
import Card from "./Card";
import api from "../../services/api";

const ForgotPasswordForm = ({ onModeChange }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);
      const { data } = await api.post("api/auth/forgot-password", { email });
      toast.success("Password reset OTP sent to your email");
      onModeChange("reset", email);
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
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/90 text-white shadow-md">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Reset password
          </h2>
          <p className="text-sm text-slate-500">
            We'll send an OTP to reset your password
          </p>
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

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <KeyRound className="h-5 w-5" />
          )}
          Send OTP
        </motion.button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Back to login
          </button>
        </p>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
