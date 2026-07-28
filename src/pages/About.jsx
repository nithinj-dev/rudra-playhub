import React from 'react';
import './RudraAbout.css';

// ─── LOGO COMPONENT ───
export const RudraLogo = ({ size = 320 }) => (
  <svg 
    viewBox="0 0 500 500" 
    width={size} 
    height={size} 
    xmlns="http://www.w3.org/2000/svg"
    className="rudra-logo-svg"
  >
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0e7490" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>

    {/* Black circular background */}
    <circle cx="250" cy="250" r="250" fill="#000000" />

    {/* Outer two-tone ring */}
    <circle cx="250" cy="250" r="228" fill="none" stroke="#0e7490" strokeWidth="26" strokeLinecap="round" />
    <circle cx="250" cy="250" r="228" fill="none" stroke="#22d3ee" strokeWidth="26" strokeLinecap="round" 
      strokeDasharray="380 1432" strokeDashoffset="0" />

    {/* Circuit base platform */}
    <path d="M95 340 L405 340 L375 298 L125 298 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
    <g stroke="#334155" strokeWidth="1.5" fill="none">
      <path d="M115 320 L140 320 L145 315 L160 315 M170 325 L195 325 M205 320 L225 320 L230 325 M245 315 L265 315 
               M275 320 L295 320 M305 325 L330 325 M340 320 L360 320 L365 315 M375 315 L385 315" />
    </g>

    {/* 3D Isometric Bars */}
    <g transform="translate(0, -15)">
      {/* Bar 1 (shortest) */}
      <path d="M140 320 L140 255 L162 245 L162 320 Z" fill="#0891b2" />
      <path d="M140 255 L182 235 L204 235 L162 245 Z" fill="#a5f3fc" />
      <path d="M162 245 L204 235 L204 320 L162 320 Z" fill="#06b6d4" />

      {/* Bar 2 */}
      <path d="M188 320 L188 195 L210 185 L210 320 Z" fill="#0891b2" />
      <path d="M188 195 L230 175 L252 175 L210 185 Z" fill="#a5f3fc" />
      <path d="M210 185 L252 175 L252 320 L210 320 Z" fill="#06b6d4" />

      {/* Bar 3 */}
      <path d="M236 320 L236 215 L258 205 L258 320 Z" fill="#0891b2" />
      <path d="M236 215 L278 195 L300 195 L258 205 Z" fill="#a5f3fc" />
      <path d="M258 205 L300 195 L300 320 L258 320 Z" fill="#06b6d4" />

      {/* Bar 4 (tallest) */}
      <path d="M284 320 L284 155 L306 145 L306 320 Z" fill="#0891b2" />
      <path d="M284 155 L326 135 L348 135 L306 145 Z" fill="#a5f3fc" />
      <path d="M306 145 L348 135 L348 320 L306 320 Z" fill="#06b6d4" />
    </g>

    {/* White trend arrow */}
    <path d="M118 265 L170 215 L212 245 L264 165 L306 125" fill="none" stroke="#ffffff" strokeWidth="16" 
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M286 135 L306 125 L312 152" fill="none" stroke="#ffffff" strokeWidth="16" 
      strokeLinecap="round" strokeLinejoin="round" />

    {/* RUDRA text */}
    <text x="250" y="390" textAnchor="middle" fill="#22d3ee" fontSize="72" fontWeight="bold" 
      fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="5">RUDRA</text>

    {/* Underline with growth arrow */}
    <line x1="95" y1="410" x2="405" y2="410" stroke="#0891b2" strokeWidth="4" />
    <path d="M95 410 L195 410 L228 442 L405 410" fill="none" stroke="#22d3ee" strokeWidth="4" 
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Subtitle */}
    <text x="250" y="455" textAnchor="middle" fill="#f8fafc" fontSize="16.5" fontFamily="Arial, sans-serif" 
      letterSpacing="2.5" fontWeight="500">RESOURCEFUL UNIT FOR DATA RESEARCH</text>
    <text x="250" y="482" textAnchor="middle" fill="#f8fafc" fontSize="16.5" fontFamily="Arial, sans-serif" 
      letterSpacing="2.5" fontWeight="500">AND ANALYTICS</text>
  </svg>
);

// ─── ABOUT / VISION / MISSION SECTION ───
const AboutSection = () => {
  return (
    <section className="rudra-about">
      <div className="rudra-container">
        
        {/* Logo (optional — remove if you only want the text section) */}
        <div className="rudra-logo-wrap">
          <RudraLogo size={280} />
        </div>

        <div className="rudra-text-block">
          <h2 className="rudra-headline">
            <span className="rudra-brand">RUDRA (Resourceful Unit for Data Research and Analytics)</span>
            <span className="rudra-headline-body">
              {' '}is the official data research and analytics community of RV University. The club provides students with opportunities to explore Data Science, Artificial Intelligence, Machine Learning, and Analytics through practical learning and collaborative projects.
            </span>
          </h2>
          <p className="rudra-paragraph">
            RUDRA organizes hackathons, coding competitions, workshops, technical sessions, industry talks, and innovation-driven events that help students gain hands-on experience and develop problem-solving skills.
          </p>
        </div>

        <div className="rudra-cards">
          {/* Vision Card */}
          <article className="rudra-card">
            <div className="rudra-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <article className="rudra-card">
            <div className="rudra-icon-box rudra-icon-box--star">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="rudra-card-title">Mission</h3>
            <ul className="rudra-card-list">
              <li><span className="rudra-bullet" />Promote data-driven learning and research.</li>
              <li><span className="rudra-bullet" />Provide hands-on experience through projects.</li>
              <li><span className="rudra-bullet" />Conduct workshops and technical events.</li>
              <li><span className="rudra-bullet" />Encourage innovation and teamwork.</li>
              <li><span className="rudra-bullet" />Bridge the gap between academics and industry.</li>
            </ul>
          </article>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;