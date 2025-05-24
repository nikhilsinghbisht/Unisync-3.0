import "./AboutUs.scss";
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
          <button onClick={() => navigate("/authentication/login")} className="loginBtn">
            Sign In
          </button>
          <button onClick={() => navigate("/authentication/signup")} className="signupBtn">
            Sign Up
          </button>
        </div>
      </header>

      <div className="aboutContainer">
        {/* Intro Section */}
        <section className="introSection">
          <div className="textSection">
            <h1 style={{ color: "#000", fontWeight: "bold" }}>About Us</h1>
            <p>
              Welcome to <strong>Unisync</strong> — a platform built by students, for students.
              Our vision is simple yet powerful: to create a connected academic ecosystem that
              encourages collaboration, nurtures growth, and enables meaningful learning
              experiences. Whether it’s sharing achievements, finding mentorship, or engaging
              with peers, Unisync empowers students with tools to thrive in their academic and
              professional journeys.
            </p>
          </div>
          <div className="imageSection">
            <img src="/team.jpg" alt="Dictoo Team" />
          </div>
        </section>

        {/* Mission Section */}
        <section className="missionSection">
          <div className="textAndImageWrapper">
            <div className="missionText">
              <h2 style={{ fontWeight: "bold" }}>Our Mission: Empower Growth Through Collaboration</h2>
              <p>
                <strong>Empowering Students:</strong> At Unisync, we aim to simplify networking,
                mentoring, and collaboration. We believe students should have access to
                opportunities and mentors at the right time in their academic journey.
              </p>
              <p>
                <strong>Fostering Innovation:</strong> We nurture creativity and innovation by
                building a collaborative environment where students can exchange ideas freely.
              </p>
              <p>
                <strong>Community First:</strong> By building a strong student-driven network,
                Unisync creates an inclusive, empowering, and future-ready space for everyone.
              </p>
            </div>
            <div className="missionImage">
              <img src="/grow.jpg" alt="Growth Better" />
            </div>
          </div>
        </section>

        {/* Story Section */}
       <section className="storySection">
  <div className="textSection"> {/* Add this wrapper for consistent alignment */}
    <h2><strong>Our Story</strong></h2>
    <p>
      Founded by four passionate individuals—Nikhil, Mohit, Hardik, and Yash, all BTech
      students—in 2024, Unisync began as a simple idea to connect like-minded students.
      Since then, we have grown into a thriving platform, helping thousands collaborate
      and succeed. Our mission is to create a supportive community where students can
      share their experiences, gain insights, and foster meaningful connections.
    </p>
    <p>
      Over time, we've evolved beyond just being a student network. Today, Unisync stands
      as a dynamic platform where students can ask questions, showcase projects, and access
      career opportunities. Our growth has been driven by continuous feedback from users
      and an unrelenting passion to build something meaningful for the student community.
    </p>
  </div>

  <div className="storyImage">
    <div className="imageTextWrapper">
      <img src="/friends.jpg" alt="Unisync Story" className="storyImg" />
      <p className="storyText">
        At Unisync, we believe that collaboration is the key to success, and we are
        committed to providing the tools and resources necessary for students to thrive
        in their personal and professional lives. Together, we are shaping a brighter
        future for the next generation of leaders and innovators.
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
            <img src="/Nikhil.jpeg" alt="Nikhil" />
            <h3>Nikhil</h3>
            <p>
              <strong>Backend Developer</strong> – Former SWE Intern at Myntra, Upcoming Cloud
              Engineer at HCL Tech, and Co-building Unisync.
            </p>
          </div>
          <div className="devCard">
            <img src="/Mohit.jpeg" alt="Mohit" />
            <h3>Mohit</h3>
            <p>
              <strong>Full Stack Developer</strong> – Currently working at CloudKeeper, driving
              robust full-stack solutions.
            </p>
          </div>
          <div className="devCard">
            <img src="/Hardik.jpeg" alt="Hardik" />
            <h3>Hardik</h3>
            <p>
              <strong>Frontend Developer</strong> – Upcoming Analyst at Capgemini, passionate
              about building seamless UIs and web experiences.
            </p>
          </div>
          <div className="devCard">
            <img src="/Yash.jpeg" alt="Yash" />
            <h3>Yash</h3>
            <p>
              <strong>Analyst</strong> – Graduate Engineer Trainee at LTI Mindtree, driving data
              insights and analysis.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <ul>
          <li>
            <img src="/src/assest/logo_500_rbg.png" alt="logo" />
            <span>© 2025</span>
          </li>
          <li><a href="">Accessibility</a></li>
          <li><a href="">User Agreement</a></li>
          <li><a href="">Privacy Policy</a></li>
          <li><a href="">Cookie Policy</a></li>
          <li><a href="">Copyright Policy</a></li>
          <li><a href="">Brand Policy</a></li>
          <li><a href="">Guest Controls</a></li>
          <li><a href="">Community Guidelines</a></li>
          <li><a href="">Language</a></li>
        </ul>
      </footer>
    </>
  );
};

export default AboutUs;
