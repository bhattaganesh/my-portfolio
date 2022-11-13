import React from "react";

function Progressbar({skillName,skillPercent}) {
  return (
    <>
      <div className="skills_data">
        <div className="skills_titles">
          <h3 className="skills_name">{skillName}</h3>
          <span className="skills_number">{skillPercent}</span>
        </div>
        <div className="skills_bar">
          <span className="skills_percentage" style={{width:skillPercent}}></span>
        </div>
      </div>
    </>
  );
}

export default Progressbar;
