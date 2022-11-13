import React from "react";
import Services from "./Services";

function ServiceContainer({
  title,
  servicesButtonHandler,
  openModal,
  modalCloseButtonHandler,
  services,
}) {
  return (
    <>
      <div className="services_content">
        <div>
          <i className="uil uil-web-grid services_icon"></i>
          <h3
            className="services_title"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h3>
        </div>
        <span
          className="button button--flex button--small button--link services_button"
          onClick={servicesButtonHandler}
        >
          View More
          <i className="uil uil-arrow-right button_icon"></i>
        </span>

        <div className={`services_modal ${openModal}`}>
          <div className="services_modal-content">
            <h4
              className="services_modal-title"
              dangerouslySetInnerHTML={{ __html: title }}
            ></h4>
            <i
              className="uil uil-times services_modal-close"
              onClick={modalCloseButtonHandler}
            ></i>
            <Services services={services} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceContainer;
