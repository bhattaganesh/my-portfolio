import React, { useState, useEffect } from "react";
import "./Scrolltop.css";
function Scrolltop() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  return (
    <>
      <a
        href="#"
        className={`scrollup ${showTopBtn ? "show_scroll" : ""}`}
        id="scroll-up"
      >
        <i className="uil uil-arrow-up scrollup_icon" onClick={goToTop}></i>
      </a>
    </>
  );
}

export default Scrolltop;
