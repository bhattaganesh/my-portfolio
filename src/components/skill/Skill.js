import React, { useState } from "react";
import "./Skill.css";
import Progressbar from "./Progressbar";
function Skill() {
  const [isOpen1, setIsOpen1] = useState(true);
  const toggle1 = () => {
    setIsOpen1(!isOpen1);
  };
  const [isOpen2, setIsOpen2] = useState(true);
  const toggle3 = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <>
      <section className="skills section" id="skills">
        <h2 className="section__title">Skills</h2>
        <span className="section__subtitle">The skills i have</span>

        <div className="skills_container container grid">
          <div>
            <div
              className={`skills_content ${
                isOpen1 ? "skills_open" : "skills_close"
              }`}
            >
              <div className="skills_header" onClick={toggle1}>
                <i className="uil uil-brackets-curly skills_icon"></i>

                <div>
                  <h1 className="skills_title">Frontend</h1>
                  <span className="skills_subtitle">More than 1 year</span>
                </div>

                <i className="uil uil-angle-down skills_arrow"></i>
              </div>
              <div className="skills_list grid">
                <Progressbar skillName={"HTML"} skillPercent={"80%"} />
                <Progressbar skillName={"CSS"} skillPercent={"50%"} />
                <Progressbar skillName={"JavaScript"} skillPercent={"70%"} />
                <Progressbar skillName={"Bootstrap"} skillPercent={"60%"} />
                <Progressbar skillName={"Twailwind"} skillPercent={"45%"} />
                <Progressbar skillName={"ReactJS"} skillPercent={"60%"} />
                <Progressbar skillName={"VeuJS"} skillPercent={"50%"} />
              </div>
            </div>
          </div>
          <div>
            <div
              className={`skills_content ${
                isOpen2 ? "skills_open" : "skills_close"
              }`}
            >
              <div className="skills_header" onClick={toggle3}>
                <i className="uil uil-server-network skills_icon"></i>

                <div>
                  <h1 className="skills_title">Backend</h1>
                  <span className="skills_subtitle">More than 2 years</span>
                </div>

                <i className="uil uil-angle-down skills_arrow"></i>
              </div>
              <div className="skills_list grid">
                <Progressbar skillName={"PHP"} skillPercent={"80%"} />
                <Progressbar skillName={"Laravel"} skillPercent={"60%"} />
                <Progressbar skillName={"Python"} skillPercent={"40%"} />
                <Progressbar skillName={"Django"} skillPercent={"50%"} />
                <Progressbar skillName={"NodeJS"} skillPercent={"40%"} />
                <Progressbar skillName={"SQL"} skillPercent={"60%"} />
                <Progressbar skillName={"MongoDB"} skillPercent={"40%"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Skill;
