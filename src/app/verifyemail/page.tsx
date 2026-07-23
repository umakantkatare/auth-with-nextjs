"use client";

import axios from "axios";
import Link from "next/link";
import { Loader2, MailCheck, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verifyUserEmail() {
    try {
      setLoading(true);
      setError(false);

      await axios.post("/api/users/verifyemail", {
        token,
      });

      setVerified(true);
    } catch (err: any) {
      console.log(err.response?.data);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const verifyToken = new URLSearchParams(window.location.search).get(
      "token",
    );
    setToken(verifyToken || "");
  }, []);

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <MailCheck className="mx-auto h-14 w-14 text-blue-500" />

          <h1 className="mt-4 text-3xl font-bold text-white">
            Verify Your Email
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Click the button below to verify your email address.
          </p>
        </div>

        {verified && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-green-500" />

            <h2 className="text-lg font-semibold text-green-400">
              Email Verified Successfully!
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Your account has been verified. You can now log in.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
            <XCircle className="mx-auto mb-2 h-10 w-10 text-red-500" />

            <h2 className="text-lg font-semibold text-red-400">
              Verification Failed
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Invalid or expired verification token.
            </p>
          </div>
        )}

        <div className="mt-8">
          {verified ? (
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={verifyUserEmail}
              disabled={!token || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <MailCheck className="h-5 w-5" />
                  Verify Email
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailPage;
