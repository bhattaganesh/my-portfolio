import React from "react";
import Home from "../home/Home";
import About from "../about/About";
import Resume from "../resume/Resume";
import Skill from "../skill/Skill";
import Service from "../service/Service";
import Contact from "../contact/Contact";
function Main() {
  return (
    <div className="main">
      <Home />
      <About />
      <Resume />
      <Skill />
      <Service />
      <Contact />
    </div>
  );
}

export default Main;
