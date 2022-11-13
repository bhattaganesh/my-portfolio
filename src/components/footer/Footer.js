import React from "react";
import "./Footer.css";
function Footer() {
  return (
    <>
      <div className="footer">
        <h2>Ganesh Bhatta</h2>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/in/ganesh-bhatta/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="uil uil-linkedin"></i>
          </a>
          <a
            href="https://www.facebook.com/ganesh.bhatta.gb"
            target="_blank"
            rel="noreferrer"
          >
            <i className="uil uil-facebook"></i>
          </a>
          <a
            href="https://github.com/bhattaganesh/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="uil uil-github"></i>
          </a>
        </div>
      </div>
      <div className="copyright">
        <p>
          All Rights Reserved &#169; Ganesh Bhatt {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}

export default Footer;
