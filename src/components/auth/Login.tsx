"use client";

import React, { useState } from "react";
import { LogIn, Phone, Mail, ShieldAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const [authMethod, setAuthMethod] = useState<"MOBILE" | "EMAIL">("MOBILE");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Call Next-Auth signIn
    const res = await signIn("credentials", {
      emailOrMobile: identifier,
      password: password || "12345", // Fallback for mobile OTP demo
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error("Invalid credentials or account not found.");
    } else {
      toast.success("Successfully logged in!");
      router.push("/"); // Root will redirect to /admin or /candidate
      router.refresh(); // Force refresh to get latest session
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-sm">Login to track your application status.</p>
        </div>

        {/* Toggle Login Method */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setAuthMethod("MOBILE")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${authMethod === "MOBILE" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Phone size={16} /> Mobile OTP
          </button>
          <button 
            type="button"
            onClick={() => setAuthMethod("EMAIL")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${authMethod === "EMAIL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Mail size={16} /> Email & Pass
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {authMethod === "MOBILE" ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
              <input 
                type="tel" 
                required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                placeholder="+1 234 567 890" 
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                  placeholder="••••••••" 
                />
              </div>
            </>
          )}

          <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2">
            <LogIn size={18} />
            {isLoading ? "Logging in..." : (authMethod === "MOBILE" ? "Send OTP" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <a href="/register" className="text-blue-600 font-bold hover:underline">Register here</a>
        </div>
      </div>
    </div>
  );
}
