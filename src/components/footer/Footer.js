import React from "react";
import "./Footer.css";
function Footer() {
  return (
    <>
      <div class="footer">
        <h2>Ganesh Bhatta</h2>
        <div class="footer-social">
          <a
            href="https://www.linkedin.com/in/ganesh-bhatta/"
            target="_blank"
            rel="noreferrer"
          >
            <i class="uil uil-linkedin"></i>
          </a>
          <a
            href="https://www.facebook.com/ganesh.bhatta.gb"
            target="_blank"
            rel="noreferrer"
          >
            <i class="uil uil-facebook"></i>
          </a>
          <a
            href="https://github.com/bhattaganesh/"
            target="_blank"
            rel="noreferrer"
          >
            <i class="uil uil-github"></i>
          </a>
        </div>
      </div>
      <div class="copyright">
        <p>
          All Rights Reserved &#169; Ganesh Bhatt {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}

export default Footer;
