import React from 'react';
import './About.css';

const RudraLogo = () => (
  <svg viewBox="0 0 200 200" className="rudra-about-logo">
    <defs>
      <linearGradient id="aboutBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
      <filter id="aboutGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer ring */}
    <circle cx="100" cy="100" r="96" fill="none" stroke="url(#aboutBorder)" strokeWidth="10" />
    <circle cx="100" cy="100" r="91" fill="#0a0a0a" />

    {/* Decorative ring dots */}
    <circle cx="100" cy="6" r="7" fill="#0ea5e9" />
    <circle cx="100" cy="194" r="7" fill="#0ea5e9" opacity="0.3" />
    <circle cx="6" cy="100" r="5" fill="#0ea5e9" opacity="0.5" />
    <circle cx="194" cy="100" r="5" fill="#0ea5e9" opacity="0.5" />

    {/* 3D Isometric Bars on diamond platform */}
    <g transform="translate(42,68)">
      {/* Platform base */}
      <polygon points="0,30 58,0 116,30 58,60" fill="#1e293b" stroke="#334155" strokeWidth="0.5" opacity="0.6" />
      <polygon points="0,30 58,60 58,68 0,38" fill="#0f172a" opacity="0.8" />
      <polygon points="58,60 116,30 116,38 58,68" fill="#1e293b" opacity="0.9" />

      {/* Bar 1 */}
      <rect x="6" y="42" width="18" height="28" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="6" y="42" width="18" height="7" fill="#38bdf8" />
      {/* Bar 2 */}
      <rect x="30" y="22" width="18" height="48" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="30" y="22" width="18" height="7" fill="#38bdf8" />
      {/* Bar 3 */}
      <rect x="54" y="32" width="18" height="38" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="54" y="32" width="18" height="7" fill="#38bdf8" />
      {/* Bar 4 */}
      <rect x="78" y="12" width="18" height="58" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="78" y="12" width="18" height="7" fill="#38bdf8" />
    </g>

    {/* White zigzag trend arrow pointing up-right */}
    <polyline
      points="52,118 78,98 102,108 128,78 152,58"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#aboutGlow)"
    />
    <polygon points="152,58 142,62 144,72" fill="white" />

    {/* RUDRA Title */}
    <text
      x="100"
      y="158"
      textAnchor="middle"
      fill="#38bdf8"
      fontSize="28"
      fontWeight="900"
      fontFamily="'Segoe UI', system-ui, sans-serif"
      letterSpacing="4"
      filter="url(#aboutGlow)"
    >
      RUDRA
    </text>

    {/* Subtitle */}
    <text
      x="100"
      y="172"
      textAnchor="middle"
      fill="#64748b"
      fontSize="6.5"
      fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif"
      letterSpacing="0.8"
    >
      RESOURCEFUL UNIT FOR DATA RESEARCH
    </text>
    <text
      x="100"
      y="180"
      textAnchor="middle"
      fill="#64748b"
      fontSize="6.5"
      fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif"
      letterSpacing="0.8"
    >
      AND ANALYTICS
    </text>

    {/* Small trend arrow bottom right */}
    <polyline points="132,178 158,158 188,138" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5" />
    <polygon points="188,138 180,142 182,150" fill="#0ea5e9" opacity="0.5" />
  </svg>
);

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Logo Area */}
        <div className="logo-wrapper">
          <div className="logo-ring">
            <div className="logo-inner">
              <RudraLogo />
            </div>
          </div>
        </div>

        {/* About Heading */}
        <div className="section-header">
          <h1 className="about-title">About RUDRA</h1>
          <div className="title-underline"></div>
        </div>

        {/* Description */}
        <div className="about-content">
          <p className="about-paragraph">
            <strong>RUDRA (Resourceful Unit for Data Research and Analytics)</strong> is the official data research and analytics community of RV University. The club provides students with opportunities to explore Data Science, Artificial Intelligence, Machine Learning, and Analytics through practical learning and collaborative projects.
          </p>

          <p className="about-paragraph">
            RUDRA organizes hackathons, coding competitions, workshops, technical sessions, industry talks, and innovation-driven events that help students gain hands-on experience and develop problem-solving skills.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="info-grid">
          {/* Vision Card */}
          <div className="info-card vision-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h2 className="card-title">Vision</h2>
            <p className="card-text">
              To create a community of innovative learners who use data and technology to solve real-world problems.
            </p>
          </div>

          {/* Mission Card */}
          <div className="info-card mission-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="card-title">Mission</h2>
            <ul className="mission-list">
              <li>Promote data-driven learning and research.</li>
              <li>Provide hands-on experience through projects.</li>
              <li>Conduct workshops and technical events.</li>
              <li>Encourage innovation and teamwork.</li>
              <li>Bridge the gap between academics and industry.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;