import React from "react";
import Home from "../home/Home";
import About from "../about/About";
import Resume from "../resume/Resume";
import Skill from "../skill/Skill";
function Main() {
  return (
    <div className="main"> 
      <Home />
      <About />
      <Resume />
      <Skill />
    </div>
  );
}

export default Main;
