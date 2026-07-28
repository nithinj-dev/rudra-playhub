import React from 'react';
import './About.css';
import rudraLogo from "../assets/rudra-logo.png";
const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Logo Area */}
        <div className="logo-wrapper">
          <div className="logo-ring">
            <div className="logo-inner">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-icon"
              >
                <path
                  d="M8 52 L20 36 L28 44 L40 24 L56 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M44 8 L56 8 L56 20"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="4" y="48" width="56" height="4" rx="2" fill="currentColor" />
              </svg>
              <span className="logo-text">RUDRA</span>
              <span className="logo-subtext">Resourceful Unit for Data Research and Analytics</span>
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