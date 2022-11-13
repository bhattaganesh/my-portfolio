import React from "react";

function Services({ services }) {
  const listItems = services.map((item, index) => (
    <li className="services_modal-service" key={index}>
      <i className="uil uil-check-circle services_modal-icon"></i>
      <p>{item}</p>
    </li>
  ));
  return (
    <>
      <ul className="services_modal-services grid">{listItems}</ul>
    </>
  );
}

export default Services;
