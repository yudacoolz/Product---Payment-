"use client";

import { useState } from "react";
import { Eye, EyeOff, Store, User } from "lucide-react";

type Role = "customer" | "merchant";

const tabs = [
  { value: "customer", label: "Customer", icon: User },
  { value: "merchant", label: "Merchant", icon: Store },
] as const;

export default function LoginForm() {
  const [role, setRole] = useState<Role>("customer");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const isCustomer = role === "customer";

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      // TODO: there is no auth API / User model yet, send { role, email, password } there once it exists
      console.log("login : ", { role, email });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* SWITCH TAB: customer / merchant */}
      <div
        role="tablist"
        className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-subtle p-1"
      >
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={role === value}
            onClick={() => setRole(value)}
            className={`flex items-center justify-center gap-2 rounded-full py-2 font-semibold transition ${
              role === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold">
        {isCustomer ? "Welcome back" : "Merchant sign in"}
      </h1>

      <p className="mt-1 text-muted">
        {isCustomer
          ? "Sign in to shop and track your orders."
          : "Sign in to manage your products and orders."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isCustomer ? "you@example.com" : "store@example.com"}
            className="w-full rounded-lg border border-line px-3 py-2 outline-none placeholder:text-muted focus:border-foreground"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line py-2 pl-3 pr-10 outline-none focus:border-foreground"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Signing in..."
            : `Sign in as ${isCustomer ? "Customer" : "Merchant"}`}
        </button>
      </form>
    </div>
  );
}
