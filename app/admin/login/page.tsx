"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@aethertrails.com");
  const [password, setPassword] = useState("aether2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1a1410] px-4">
      <form onSubmit={handleSubmit} className="bg-[#f6f1e8] p-10 rounded-[2rem] w-full max-w-sm space-y-4">
        <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">Staff</p>
        <h1 className="font-display text-4xl">Planner login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-3 py-2.5 text-sm"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-3 py-2.5 text-sm"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Enter the house"}
        </button>
        <p className="text-xs text-muted-foreground">Demo: owner@aethertrails.com / aether2026</p>
      </form>
    </main>
  );
}
