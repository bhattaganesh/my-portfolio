import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Contact() {
  const showToastMessage = (msg, level) => {
    let toaster;
    if ("success" === level) {
      toaster = toast.success;
    } else if ("error" === level) {
      toaster = toast.error;
    } else {
      toaster = toast.success;
    }
    toaster(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    if ("" == form.current.elements.user_name.value) {
      showToastMessage("Please enter your name.", "error");
    } else if ("" == form.current.elements.user_email.value) {
      showToastMessage("Please enter your email.", "error");
    } else if ("" == form.current.elements.message.value) {
      showToastMessage("Please enter your message.", "error");
    } else if (
      false ===
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        form.current.elements.user_email.value
      )
    ) {
      showToastMessage("Please enter the valid email.", "error");
    } else {
      emailjs
        .sendForm(
          "service_54uiipe",
          "template_qtuym6q",
          form.current,
          "OcjwhjMd5-0q7J4KK"
        )
        .then(
          (result) => {
            form.current.reset();
            showToastMessage("Thanks! for contacting me.", "success");
          },
          (error) => {
            showToastMessage(
              "Sorry!, error occured while sending message.",
              "error"
            );
          }
        );
    }
  };
  return (
    <>
      <section className="contact section" id="contact">
        <h2 className="section__title">Contact</h2>
        <span className="section__subtitle">
          Let's keep in touch
          <br />I do receive your messages and will respond asap if the valid
          email is provided :)
        </span>

        <div className="contact_container container grid">
          <div>
            <div className="contact_information">
              <i className="uil uil-phone contact_icon"></i>

              <div>
                <h3 className="contact_title">Call Me</h3>
                <span className="contact_subtitle">+977-9848979669</span>
              </div>
            </div>
            <div className="contact_information">
              <i className="uil uil-envelope contact_icon"></i>
              <div>
                <h3 className="contact_title">Email</h3>
                <span className="contact_subtitle">
                  bhattaganesh05@gmail.com
                </span>
              </div>
            </div>
            <div className="contact_information">
              <i className="uil uil-map-marker contact_icon"></i>
              <div>
                <h3 className="contact_title">Address</h3>
                <span className="contact_subtitle">
                  Godawari-02, Kailali, Nepal
                </span>
              </div>
            </div>
            <div className="contact_information">
              <i className="uil uil-globe contact_icon"></i>
              <div>
                <h3 className="contact_title">website</h3>
                <span className="contact_subtitle">ganeshbhatt.com.np</span>
              </div>
            </div>
          </div>

          <form className="contact_form grid" id="contact_form" ref={form}>
            <div className="contact_inputs grid">
              <div className="contact_content">
                <label htmlFor="user_name" className="contact_label">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  className="user_name contact_input"
                />
              </div>
              <div className="contact_content">
                <label htmlFor="user_email" className="contact_label">
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  className="user_email contact_input"
                />
              </div>
            </div>
            <div className="contact_content">
              <label htmlFor="message" className="contact_label">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                cols="0"
                rows="3"
                className="message contact_input"
              ></textarea>
            </div>
            <div>
              <a
                className="button button--flex"
                rel="noopener noreferrer"
                onClick={sendEmail}
              >
                Send Message
                <i className="uil uil-location-arrow button_icon"></i>
              </a>
              <ToastContainer />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
