import "./About.css";
import rudraLogo from "../assets/rudra-logo.png";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">

        <img
          src={rudraLogo}
          alt="RUDRA Logo"
          className="about-logo"
        />

        <h1>About RUDRA</h1>

        <p>
          <strong>RUDRA (Resourceful Unit for Data Research and Analytics)</strong>
          is the official data research and analytics community of RV University.
          The club provides students with opportunities to explore Data Science,
          Artificial Intelligence, Machine Learning, and Analytics through
          practical learning and collaborative projects.
        </p>

        <p>
          RUDRA organizes hackathons, coding competitions, workshops,
          technical sessions, industry talks, and innovation-driven events
          that help students gain hands-on experience and develop
          problem-solving skills.
        </p>

        <h2>Vision</h2>

        <p>
          To create a community of innovative learners who use data and
          technology to solve real-world problems.
        </p>

        <h2>Mission</h2>

        <ul>
          <li>Promote data-driven learning and research.</li>
          <li>Provide hands-on experience through projects.</li>
          <li>Conduct workshops and technical events.</li>
          <li>Encourage innovation and teamwork.</li>
          <li>Bridge the gap between academics and industry.</li>
        </ul>

      </div>
    </div>
  );
}

export default About;