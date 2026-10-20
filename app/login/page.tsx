"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import "./login.css";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect to the chosen authentication provider.
    // The server must verify credentials and determine the user's role.
    setMessage("Sign-in is not connected yet.");
  }

  return (
    <main className="login-page">
      <section className="login-formSection" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brandMark">T&amp;P</span>
          <span>NIT TIRUCHIRAPPALLI<span className="login-department">METALLURGICAL &amp; MATERIALS ENGINEERING</span></span>
        </div>

        <div className="login-formContent">
          <p className="login-eyebrow">DEPARTMENT WORKSPACE</p>
          <h1 id="login-title">Welcome back.</h1>
          <p className="login-intro">Sign in to explore MME placement records.</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="username" placeholder="Enter your email" required />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="login-submit">Sign in <span aria-hidden="true">↗</span></button>
            <p className="login-message" role="status" aria-live="polite">{message}</p>
          </form>
        </div>

        <footer className="login-footer">MME · Training and Placement</footer>
      </section>

      <section className="login-hero" aria-label="Blueprint building illustration">
        <div className={`login-layer login-glow`} aria-hidden="true" />
        <div className={`login-layer login-grid`} aria-hidden="true" />
        <div className={`login-layer login-building`} aria-hidden="true">
          <Image src="/login-building.webp" alt="" width={640} height={535} unoptimized priority />
        </div>
        <div className={`login-layer login-vignette`} aria-hidden="true" />
        <div className={`login-layer login-overlay`} aria-hidden="true">
          <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
            <circle className="login-arc" cx="1250" cy="520" r="640" />
            <circle className="login-ring" cx="730" cy="230" r="8" />
            <g className="login-plus"><path d="M1432 66v20M1422 76h20" /><path d="M1568 405v20M1558 415h20" /><path d="M622 857v20M612 867h20" /></g>
          </svg>
        </div>
      </section>
    </main>
  );
}
