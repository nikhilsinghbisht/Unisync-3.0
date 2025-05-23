// import { useState, useEffect } from "react";
import "./AboutUs.scss"; // External CSS file for styling
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="mainHeader">
        <div className="container_logo">
          <a href="/">
            <img
              style={{ width: "15rem" }}
              src="/src/assest/logo_500_rbg.png"
              alt="Unisync Logo"
            />
          </a>
        </div>
        <div className="authButtons">
          <button
            onClick={() => navigate("/authentication/login")}
            className="loginBtn"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/authentication/signup")}
            className="signupBtn"
          >
            Sign Up
          </button>
        </div>
      </header>

      <div className="aboutContainer">
        {/* Intro Section */}
        <section className="introSection">
          <div className="textSection">
            <h1>About Us</h1>
            <p>
              Unisync is a platform dedicated to connecting students, fostering
              growth and collaboration through intuitive, powerful tools. It
              allows students to connect with each other, post their
              achievements, and ask their queries..
            </p>
          </div>
          <div className="imageSection">
            <img
              src="/team.jpg"
              alt="Dictoo Team"
            />
          </div>
        </section>

        {/* Mission Section */}
        <section className="missionSection">
          <div className="textAndImageWrapper">
            <div className="missionText">
              <h2>Our Mission: Empower Growth Through Collaboration</h2>
              <p>
                At Unisync, we aim to simplify networking, mentoring, and
                collaboration. By fostering a strong community, we empower users
                to grow and achieve their best.
              </p>
            </div>
            <div className="missionImage">
              <img
                src="/grow.jpg"
                alt="Growth Better"
              />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="storySection">
          <h2>Our Story</h2>
          <p>
            Founded by four passionate individuals—Nikhil, Mohit, Hardik, and
            Yash, all BTech students—in 2024, Unisync began as a simple idea to
            connect like-minded students. Since then, we have grown into a
            thriving platform, helping thousands collaborate and succeed. Our
            mission is to create a supportive community where students can share
            their experiences, gain insights, and foster meaningful connections.
            Through innovative features and an intuitive interface, we strive to
            empower students to achieve their goals and make the most of their
            academic journeys.
          </p>
          <div className="storyImage">
            <div className="imageTextWrapper">
              <img
                src="/friends.jpg"
                alt="Unisync Story"
                className="storyImg"
              />
              <p className="storyText">
                At Unisync, we believe that collaboration is the key to success,
                and we are committed to providing the tools and resources
                necessary for students to thrive in their personal and
                professional lives. Together, we are shaping a brighter future
                for the next generation of leaders and innovators. We invite
                students and professionals alike to connect, share ideas, and
                extend their networks within our vibrant community. Our platform
                fosters open communication and collaboration, empowering users
                to learn from each other and grow together. Join us in this
                journey, and let's build a supportive ecosystem where everyone
                can achieve their aspirations and make a meaningful impact.
                Together, we can turn ideas into reality and inspire future
                generations to reach new heights.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="statsSection">
          <h2>Unisync by the Numbers</h2>
          <div className="statsGrid">
            <div className="statItem">
              <h3>50+</h3>
              <p>Collaborating Institutions</p>
            </div>
            <div className="statItem">
              <h3>10,000+</h3>
              <p>Active Users</p>
            </div>
            <div className="statItem">
              <h3>100,000+</h3>
              <p>Messages Exchanged</p>
            </div>
          </div>
        </section>
      </div>
      {/* Developers Section */}
      <section className="developersSection">
        <h2>Meet the Developers</h2>
        <div className="developerCards">
          <div className="devCard">
            <img
              src="/Nikhil.jpeg"
              alt="Nikhil"
            />
            <h3>Nikhil</h3>
            <p>Backend Developer</p>
          </div>
          <div className="devCard">
            <img
              src="/Mohit.jpeg"
              alt="Mohit"
            />
            <h3>Mohit</h3>
            <p>Backend Developer</p>
          </div>
          <div className="devCard">
            <img
              src="/Hardik.jpeg"
              alt="Hardik"
            />
            <h3>Hardik</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="devCard">
            <img
              src="/Yash.jpeg"
              alt="Yash"
            />
            <h3>Yash</h3>
            <p>Analyst</p>
          </div>
        </div>
      </section>
      <footer>
        <ul>
          <li>
            <img
              src="/src/assest/logo_500_rbg.png"
              alt="image"
            />
            <span>© 2025</span>
          </li>
          <li>
            <a href="">Accessiblity</a>
          </li>
          <li>
            <a href="">User Agreement</a>
          </li>
          <li>
            <a href="">Privacy Policy</a>
          </li>
          <li>
            <a href="">Cookie Policy</a>
          </li>
          <li>
            <a href="">Copywright Policy</a>
          </li>
          <li>
            <a href="">Brand Policy</a>
          </li>
          <li>
            <a href="">Guest Controls</a>
          </li>
          <li>
            <a href="">Community Guidelines</a>
          </li>
          <li>
            <a href="">Language</a>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default AboutUs;
