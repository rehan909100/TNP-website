"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect to the chosen authentication provider.
    // The server must verify credentials and determine the user's role.
    setMessage("Sign-in is not connected yet.");
  }

  return (
    <main className={styles.page}>
      <section className={styles.formSection} aria-labelledby="login-title">
        <div className={styles.brand}>
          <span className={styles.brandMark}>T&amp;P</span>
          <span>NIT TIRUCHIRAPPALLI<span className={styles.department}>METALLURGICAL &amp; MATERIALS ENGINEERING</span></span>
        </div>

        <div className={styles.formContent}>
          <p className={styles.eyebrow}>DEPARTMENT WORKSPACE</p>
          <h1 id="login-title">Welcome back.</h1>
          <p className={styles.intro}>Sign in to explore MME placement records.</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="username" placeholder="Enter your email" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className={styles.submit}>Sign in <span aria-hidden="true">↗</span></button>
            <p className={styles.message} role="status" aria-live="polite">{message}</p>
          </form>
        </div>

        <footer className={styles.footer}>MME · Training and Placement</footer>
      </section>

      <section className={styles.hero} aria-label="Blueprint building illustration">
        <div className={`${styles.layer} ${styles.glow}`} aria-hidden="true" />
        <div className={`${styles.layer} ${styles.grid}`} aria-hidden="true" />
        <div className={`${styles.layer} ${styles.building}`} aria-hidden="true">
          <Image src="/login-building.webp" alt="" width={640} height={535} unoptimized priority />
        </div>
        <div className={`${styles.layer} ${styles.vignette}`} aria-hidden="true" />
        <div className={`${styles.layer} ${styles.overlay}`} aria-hidden="true">
          <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
            <circle className={styles.arc} cx="1250" cy="520" r="640" />
            <circle className={styles.ring} cx="730" cy="230" r="8" />
            <g className={styles.plus}><path d="M1432 66v20M1422 76h20" /><path d="M1568 405v20M1558 415h20" /><path d="M622 857v20M612 867h20" /></g>
          </svg>
        </div>
      </section>
    </main>
  );
}
