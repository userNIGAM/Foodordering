import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import Input from "./Input";
import Card from "./Card";
import api from "../../services/api";
const ResetPasswordForm = ({ email, onModeChange }) => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const { data } = await api.post("api/auth/reset-password", {
        email,
        otp,
        password,
      });
      toast.success("Password reset successfully");
      onModeChange("login");
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
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">New password</h2>
          <p className="text-sm text-slate-500">
            Enter OTP and set new password
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Verification OTP
          </label>
          <Input
            icon={KeyRound}
            name="otp"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter 6-digit OTP"
            autoComplete="one-time-code"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            New Password
          </label>
          <Input
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your new password"
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
            <KeyRound className="h-5 w-5" />
          )}
          Reset Password
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

export default ResetPasswordForm;
