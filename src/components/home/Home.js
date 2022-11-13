import React from "react";
import "./Home.css";
import home_img from "../../assets/img/home.png";
import Typed from "react-typed";
import { Link } from "react-scroll";
function Home() {
  return (
    <>
      <section className="home section" id="home">
        <div className="home_container container grid">
          <div className="home_img">
            <img src={home_img} alt="Ganesh's Pic" />
          </div>

          <div className="home_data">
            <h1 className="home_title">
              <Typed strings={["Hi, I'm Ganesh 🤚"]} typeSpeed={40} />
            </h1>
            <h3 className="home_subtitle">
              <Typed
                strings={[
                  "I'm a Full Stack Developer",
                  "I'm an Enthusiastic Developer",
                  "I Love Web Development",
                ]}
                typeSpeed={150}
                backSpeed={100}
                loop
              />
            </h3>
            <p className="home_description">
              High level experience in backend and frontend development,
              producing quality work.
            </p>
            <Link
              smooth={true}
              spy={true}
              to="contact"
              className="button button--flex"
            >
              Contact Me
            </Link>
            <div className="home_social">
              <span className="home_social-follow">Follow Me</span>
              <div className="home_social-links">
                <a
                  href="https://www.linkedin.com/in/ganesh-bhatta/"
                  target="_blank"
                  rel="noreferrer"
                  className="home_social-icon"
                >
                  <i className="uil uil-linkedin"></i>
                </a>
                <a
                  href="https://www.facebook.com/ganesh.bhatta.gb"
                  target="_blank"
                  rel="noreferrer"
                  className="home_social-icon"
                >
                  <i className="uil uil-facebook"></i>
                </a>
                <a
                  href="https://github.com/bhattaganesh/"
                  target="_blank"
                  rel="noreferrer"
                  className="home_social-icon"
                >
                  <i className="uil uil-github"></i>
                </a>
              </div>
            </div>

            <div className="home_scroll_social">
              <div className="home_social1">
                <div className="home_social-link">
                  <span className="home_social-follow">Follow Me</span>
                  <a
                    href="https://www.linkedin.com/in/ganesh-bhatta/"
                    target="_blank"
                    rel="noreferrer"
                    className="home_social-icon"
                  >
                    <i className="uil uil-linkedin"></i>
                  </a>
                  <a
                    href="https://www.facebook.com/ganesh.bhatta.gb"
                    target="_blank"
                    rel="noreferrer"
                    className="home_social-icon"
                  >
                    <i className="uil uil-facebook"></i>
                  </a>
                  <a
                    href="https://github.com/bhattaganesh/"
                    target="_blank"
                    rel="noreferrer"
                    className="home_social-icon"
                  >
                    <i className="uil uil-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
