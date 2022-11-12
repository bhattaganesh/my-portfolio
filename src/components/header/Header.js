import React, { useState, useEffect } from "react";
import DarkMode from "../darkmode/DarkMode";
import "./Header.css";
import { Link } from "react-scroll";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => {
    setIsOpen(false);
  };

  const [scrollHeader, setScrollHeader] = useState("");
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (this.scrollY >= 80) {
        setScrollHeader("scroll_header");
      }
    });
  }, []);
  return (
    <>
      <header className={`header ${scrollHeader}`} id="header">
        <nav className="nav container">
          <Link smooth={true} spy={true} to="home" className="nav_logo">
            GANESH
          </Link>
          <div
            className={`nav_menu ${isOpen ? "show_menu" : ""}`}
            id="nav-menu"
          >
            <ul className="nav_list">
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="home"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="about"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="resume"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  Resume
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="skills"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  Skills
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="services"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  activeClass="active_link"
                  smooth={true}
                  spy={true}
                  to="contact"
                  className="nav_link"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="nav_close" id="nav-close" onClick={closeMenu}>
              <i className="uil uil-times nav_close" id="nav-close"></i>
            </div>
          </div>

          <div className="nav_btns">
            <DarkMode />
            <div
              className="nav_toogle"
              id="nav-toggle"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <i className="uil uil-bars"></i>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
