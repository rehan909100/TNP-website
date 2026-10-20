"use client";

import { useState } from "react";
import "./dashboard.css";

type View = "Home" | "Dashboard";

// Presentation-only shell. Do not load student records until server-side
// authentication and authorized aggregate queries are implemented.
export default function Home() {
  const [view, setView] = useState<View>("Home");

  return (
    <div className="dashboard-preview">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="portal-shell">
        <aside className="sidebar">
          <div className="wordmark"><b>TNP</b><span>MME<br /><strong>NIT TRICHY</strong></span></div>
          <p className="sidebar-caption">HISTORICAL PLACEMENTS</p>
          <nav aria-label="Main navigation">
            {(["Home", "Dashboard"] as const).map((item) => (
              <button key={item} className={view === item ? "active" : ""}
                aria-current={view === item ? "page" : undefined}
                aria-label={item} onClick={() => setView(item)}>
                <span aria-hidden="true">{item === "Home" ? "H" : "D"}</span>{item}
              </button>
            ))}
          </nav>
          <div className="profile"><b>MME</b><span>Department workspace<small>Interface preview</small></span></div>
        </aside>
        <main id="main-content" className="content-area" tabIndex={-1}>
          <header className="topbar"><span>MME / {view.toUpperCase()}</span><span>NIT TIRUCHIRAPPALLI</span></header>
          <p className="preview-notice">Interface preview · Historical data is not connected yet.</p>
          {view === "Home" ? (
            <section className="home-view" aria-labelledby="home-title">
              <div className="home-hero">
                <p className="eyebrow">METALLURGICAL &amp; MATERIALS ENGINEERING</p>
                <h1 id="home-title">Six years.<br /><em>One clear view.</em></h1>
                <p>Explore historical placement outcomes, company participation, and compensation across MME graduating batches.</p>
                <div className="home-actions"><button className="dark-button" onClick={() => setView("Dashboard")}>Open dashboard <span aria-hidden="true">→</span></button></div>
              </div>
              <div className="home-grid">
                <button className="home-card coral-card" onClick={() => setView("Dashboard")}><span>01 / OUTCOMES</span><strong>Placement<br />dashboard</strong><small>Batch outcomes and compensation summaries <b aria-hidden="true">→</b></small></button>
                <div className="home-card dark-card"><span>02 / HISTORY</span><strong>Across<br />graduating batches</strong><small>Year-to-year comparisons will appear when historical records are available.</small></div>
                <div className="home-note"><span>DATA AVAILABILITY</span><strong>Awaiting historical data</strong><p>No placement figures are displayed until records are connected.</p></div>
              </div>
            </section>
          ) : (
            <section aria-labelledby="dashboard-title">
              <div className="page-heading">
                <div><p className="eyebrow">HISTORICAL ANALYTICS</p><h1 id="dashboard-title">Placement overview</h1><p>Outcomes for eligible MME students, grouped by graduating batch.</p></div>
                <div className="heading-actions"><label htmlFor="batch">BATCH <select id="batch" disabled aria-describedby="batch-help"><option>No batches available</option></select></label></div>
              </div>
              <p id="batch-help" className="data-help">Batch options will come from stored historical records.</p>
              <div className="metric-grid">
                {[
                  ["PLACEMENT RATE", "Requires a complete eligible roster", "coral"],
                  ["STUDENTS PLACED", "Students with a recorded offer", "yellow"],
                  ["AVERAGE PACKAGE", "Recorded compensation in LPA", "blue"],
                  ["MEDIAN PACKAGE", "Recorded compensation in LPA", "violet"],
                ].map(([label, description, color]) => (
                  <article className={`metric ${color}`} key={label}><h2>{label}</h2><strong aria-label="Not available">—</strong><p>{description}</p></article>
                ))}
              </div>
              <div className="dashboard-grid">
                <EmptyPanel eyebrow="BATCH OUTCOMES" title="Placement split" description="Placed and unplaced student totals will appear here." />
                <EmptyPanel eyebrow="COMPANY PARTICIPATION" title="Offers by company" description="Company counts will be calculated from recorded offers." />
                <EmptyPanel eyebrow="YEAR-ON-YEAR" title="Batch comparison" description="Compare outcomes across available graduating batches." />
                <EmptyPanel eyebrow="COMPENSATION" title="Package distribution" description="Only known compensation values will contribute to these statistics." />
                <EmptyPanel eyebrow="OFFER MIX" title="Placement types" description="Offers will be grouped as PPO, FTE, and FTE+6month." />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyPanel({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="panel"><div className="panel-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div><div className="empty-state"><p>No historical data available</p><small>{description}</small></div></section>;
}
