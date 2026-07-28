import React from 'react';
import './RudraAbout.css';

const RudraAbout = () => {
  return (
    <div className="rudra-page">
      {/* ─── BACKGROUND EFFECTS ─── */}
      <div className="rudra-bg-orb orb-1" />
      <div className="rudra-bg-orb orb-2" />

      {/* ─── HERO / LOGO SECTION ─── */}
      <section className="rudra-hero">
        <div className="rudra-logo-container">
          <div className="rudra-logo-glow" />
          <img 
            src="/rudra-logo.png" 
            alt="RUDRA Logo" 
            className="rudra-logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300/000000/00d4ff?text=RUDRA';
            }}
          />
        </div>
        <h1 className="rudra-hero-title">RUDRA</h1>
        <p className="rudra-hero-subtitle">
          Resourceful Unit for Data Research and Analytics
        </p>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="rudra-section">
        <div className="rudra-container">
          <div className="rudra-glass-card rudra-about-card">
            <div className="rudra-card-accent" />
            <h2 className="rudra-section-title">About RUDRA</h2>
            <p className="rudra-body-text">
              <span className="rudra-highlight">RUDRA</span> stands for{' '}
              <span className="rudra-highlight">Resourceful Unit for Data Research and Analytics</span>. 
              It is the official data research and analytics community of{' '}
              <span className="rudra-highlight">RV University</span>.
            </p>
            <p className="rudra-body-text">
              Our community focuses on cutting-edge domains including{' '}
              <span className="rudra-accent-text">Artificial Intelligence</span>,{' '}
              <span className="rudra-accent-text">Machine Learning</span>,{' '}
              <span className="rudra-accent-text">Data Science</span>, and{' '}
              <span className="rudra-accent-text">Analytics</span>. We provide students with 
              practical learning opportunities, hands-on projects, hackathons, workshops, and 
              technical events that bridge the gap between theory and real-world application.
            </p>
          </div>
        </div>
      </section>

      {/* ─── VISION & MISSION ─── */}
      <section className="rudra-section">
        <div className="rudra-container">
          <div className="rudra-cards-grid">
            
            {/* Vision Card */}
            <article className="rudra-glass-card rudra-card-hover">
              <div className="rudra-card-accent" />
              <div className="rudra-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="rudra-card-title">Vision</h3>
              <p className="rudra-card-text">
                To create a community of innovative learners who use data and technology to solve real-world problems.
              </p>
            </article>

            {/* Mission Card */}
            <article className="rudra-glass-card rudra-card-hover">
              <div className="rudra-card-accent" />
              <div className="rudra-card-icon rudra-icon-star">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="rudra-card-title">Mission</h3>
              <ul className="rudra-mission-list">
                <li><span className="rudra-mission-bullet" />Promote data-driven learning and research.</li>
                <li><span className="rudra-mission-bullet" />Provide hands-on experience through projects.</li>
                <li><span className="rudra-mission-bullet" />Conduct workshops and technical events.</li>
                <li><span className="rudra-mission-bullet" />Encourage innovation and teamwork.</li>
                <li><span className="rudra-mission-bullet" />Bridge the gap between academics and industry.</li>
              </ul>
            </article>

          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="rudra-footer">
        <div className="rudra-footer-line" />
        <p className="rudra-footer-text">
          © {new Date().getFullYear()} <span className="rudra-footer-brand">RUDRA</span> — Resourceful Unit for Data Research and Analytics
        </p>
        <p className="rudra-footer-tagline">Empowering Innovation Through Data</p>
      </footer>
    </div>
  );
};

export default RudraAbout;