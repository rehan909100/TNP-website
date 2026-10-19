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

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`${styles.layer} ${styles.glow}`} aria-hidden="true" />
        <div className={`${styles.layer} ${styles.grid}`} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>NIT TIRUCHIRAPPALLI</p>
          <h2 id="hero-title">Six years of outcomes.<br /><span>One clear perspective.</span></h2>
        </div>
        <div className={styles.building}>
          <Image src="/login-building.webp" alt="NIT Tiruchirappalli building and clock tower" fill sizes="(max-width: 800px) 100vw, 56vw" priority className={styles.buildingImage} />
        </div>
        <div className={`${styles.layer} ${styles.vignette}`} aria-hidden="true" />
        <div className={`${styles.layer} ${styles.overlay}`} aria-hidden="true">
          <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
            <circle className={styles.arc} cx="500" cy="620" r="420" />
            <circle className={styles.ring} cx="130" cy="340" r="8" />
            <g className={styles.plus}><path d="M720 130v20M710 140h20" /><path d="M740 560v20M730 570h20" /><path d="M90 860v20M80 870h20" /></g>
          </svg>
        </div>
        <p className={styles.heroCaption}>METALLURGICAL &amp; MATERIALS ENGINEERING <span>01 / HISTORICAL PLACEMENTS</span></p>
      </section>
    </main>
  );
}
