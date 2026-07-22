"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const isButtonDisabled =
      !user.username.trim() || !user.email.trim() || !user.password.trim();
    setButtonDisabled(isButtonDisabled);
  }, [user]);

  const handleSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("/api/users/signup", user);

      toast.success(response.data.message || "Account created successfully.");

      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-sm text-gray-400">Sign Up</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Username</label>
            <input
              type="text"
              placeholder="John Doe"
              value={user.username}
              onChange={(e) =>
                setUser({
                  ...user,
                  username: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={user.password}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className="flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-500/40"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10" />
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
