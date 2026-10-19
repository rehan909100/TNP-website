"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: Connect to the chosen authentication provider.
    // Read credentials with new FormData(event.currentTarget) when integrating.
    // The server must verify credentials and determine the user's role.
    setMessage("Sign-in is not connected yet.");
  }

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-12">
      {/* Add LoginLogo and TnpTitle here if desired. */}
      <h1 className="mb-2 text-2xl font-semibold">Login</h1>
      <p className="mb-6">MME Training and Placement</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button type="submit" className="rounded border px-3 py-2">
          Sign in
        </button>
        <p role="status" aria-live="polite">{message}</p>
      </form>
    </main>
  );
}
