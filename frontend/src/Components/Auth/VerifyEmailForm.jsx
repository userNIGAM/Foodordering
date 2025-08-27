import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import Input from "./Input";
import Card from "./Card";
import api from "../services/api";

const VerifyEmailForm = ({ email, onModeChange }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);
      const { data } = await api.post("api/auth/verify-email", {
        email,
        otp,
      });
      toast.success("Email verified successfully");
      onModeChange("login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await api.post("api/auth/resend-verification", { email });
      toast.success("Verification OTP sent. Check your inbox.");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to resend verification";
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
          <h2 className="text-xl font-semibold text-slate-800">Verify email</h2>
          <p className="text-sm text-slate-500">
            Enter the OTP sent to your email
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm">
              We've sent an OTP to <span className="font-medium">{email}</span>.
            </p>
          </div>
          <button
            onClick={handleResend}
            disabled={loading}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Resend"}
          </button>
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
          <div className="mt-1 text-xs text-slate-500">
            <span>Check your email for the OTP</span>
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
          Verify OTP
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

export default VerifyEmailForm;
