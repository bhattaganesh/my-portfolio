import React from "react";
import "./Resume.css";
function Resume() {
  return (
    <>
      <section className="resume section" id="resume">
        <h2 className="section__title">Resume</h2>
        <span className="section__subtitle">My personal journel</span>

        <div className="resume_container container">
          <div className="resume_tabs">
            <div className="resume_button button--flex">
              <i className="uil uil-graduation-cap resume_icon"></i>
              Education
            </div>
            <div className="resume_button button--flex">
              <i className="uil uil-briefcase-alt resume_icon"></i>Work
            </div>
          </div>

          <div className="resume_sections">
            <div
              className="resume_content resume_active"
              data-content
              id="education"
            >
              <div className="resume_data">
                <div></div>

                <div>
                  <span className="resume_rounder"></span>
                  <span className="resume_line"></span>
                </div>
                <div>
                  <h3 className="resume_title">PHP Developer</h3>
                  <span className="resume_subtitle">ThemeGrill Pvt. Ltd.</span>
                  <div className="resume_calender">
                    <i className="uil uil-calender"></i>
                    2021 - present
                  </div>
                </div>
              </div>

              <div className="resume_data">
                <div>
                  <h3 className="resume_title">B.Sc. CSIT</h3>
                  <span className="resume_subtitle">Tribhuvan University</span>
                  <div className="resume_calender">
                    <i className="uil uil-calender"></i>
                    2016 - 2021
                  </div>
                </div>
                <div>
                  <span className="resume_rounder"></span>
                  <span className="resume_line"></span>
                </div>
              </div>

              <div className="resume_data">
                <div>
                  <h3 className="resume_title">High School(I.Sc.)</h3>
                  <span className="resume_subtitle">
                    Aisswariya Vidya Niketan, Dhangadhi, Kailali
                  </span>
                  <div className="resume_calender">
                    <i className="uil uil-calender"></i>
                    2014 - 2016
                  </div>
                </div>
                <div>
                  <span className="resume_rounder"></span>
                  <span className="resume_line"></span>
                </div>
              </div>
              <div className="resume_data">
                <div>
                  <h3 className="resume_title">
                    School Leaving Certificate(SLC)
                  </h3>
                  <span className="resume_subtitle">
                    Shree Bir Bal Bhadra, Koteli, Dadeldhura
                  </span>
                  <div className="resume_calender">
                    <i className="uil uil-calender"></i>
                    2004 - 2014
                  </div>
                </div>
                <div>
                  <span className="resume_rounder"></span>
                  <span className="resume_line"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Resume;
