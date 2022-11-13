import React from "react";
import "./About.css";
import about_img from "../../assets/img/about.jpeg";
import pdf from "../../assets/pdf/Ganesh's_Resume.pdf";

function About() {
  return (
    <>
      <section className="about section" id="about">
        <h2 className="section__title">About Me</h2>
        <span className="section__subtitle">Who am i?</span>

        <div className="about_container container grid">
          <img src={about_img} alt="" className="about_img" />

          <div className="about_data">
            <p className="about_description">
              I am passionate fullStack web developer, with extencive knowledge
              and years of experience, working in web technologies, delivering
              quality work. I have pursued B.Sc. CSIT Degree in Computer Science
              and Information Technolog from Tribhuvan University. I am so
              fuild, focused and willing to learn new things. In all, i believe
              in knowledge integrations.
            </p>
            <div className="about_info">
              <div>
                <span className="about_info-title">02+</span>
                <span className="about_info-name">
                  Years <br />
                  experience
                </span>
              </div>
              <div>
                <span className="about_info-title">20+</span>
                <span className="about_info-name">
                  Completed <br />
                  project
                </span>
              </div>
            </div>
            <div className="about_buttons">
              <a
                href={pdf}
                className="button button--flex"
                rel="noopener noreferrer"
                download="Ganesh's_Resume.pdf"
              >
                Get Resume <i className="uil uil-download-alt button_icon"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
