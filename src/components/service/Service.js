import React, { useState } from "react";
import "./Service.css";
import Services from "./Services";
import ServiceContainer from "./ServiceContainer";
function Service() {
  const [openModal1, setOpenModal1] = useState("");
  const servicesButtonHandler1 = () => {
    setOpenModal1("active_modal");
  };
  const modalCloseButtonHandler1 = () => {
    setOpenModal1("");
  };

  const [openModal2, setOpenModal2] = useState("");
  const servicesButtonHandler2 = () => {
    setOpenModal2("active_modal");
  };
  const modalCloseButtonHandler2 = () => {
    setOpenModal2("");
  };

  const [openModal3, setOpenModal3] = useState("");
  const servicesButtonHandler3 = () => {
    setOpenModal3("active_modal");
  };
  const modalCloseButtonHandler3 = () => {
    setOpenModal3("");
  };

  const [openModal4, setOpenModal4] = useState("");
  const servicesButtonHandler4 = () => {
    setOpenModal4("active_modal");
  };
  const modalCloseButtonHandler4 = () => {
    setOpenModal4("");
  };

  const frontendServices = [
    "Web Apps and Portals using ReactJS",
    "Web Apps and Portals using VueJS",
    "Web Apps and Portals using vanilla JS",
  ];
  const backendServices = [
    "Web Apps and Portals using PHP Laravel",
    "Wordpress Plugin Development",
    "Web Apps and Portals using Python Django",
    "Web Apps and Portals using NodeJS",
  ];
  const apiServices = ["i will develop APIs"];
  const databaseServices = [
    "i will design database using MySQL, PostgreSQL and MongoDB",
  ];
  return (
    <>
      <section className="services section" id="services">
        <h2 className="section__title">Services</h2>
        <span className="section__subtitle">What i do?</span>

        <div className="services_container container grid">
          <ServiceContainer
            title={"Frontend <br /> Development"}
            servicesButtonHandler={servicesButtonHandler1}
            openModal={openModal1}
            modalCloseButtonHandler={modalCloseButtonHandler1}
            services={frontendServices}
          />
          <ServiceContainer
            title={"Backend <br /> Development"}
            servicesButtonHandler={servicesButtonHandler2}
            openModal={openModal2}
            modalCloseButtonHandler={modalCloseButtonHandler2}
            services={backendServices}
          />
          <ServiceContainer
            title={"API <br /> Development"}
            servicesButtonHandler={servicesButtonHandler3}
            openModal={openModal3}
            modalCloseButtonHandler={modalCloseButtonHandler3}
            services={apiServices}
          />
          <ServiceContainer
            title={"Database <br /> Design"}
            servicesButtonHandler={servicesButtonHandler4}
            openModal={openModal4}
            modalCloseButtonHandler={modalCloseButtonHandler4}
            services={databaseServices}
          />
        </div>
      </section>
    </>
  );
}

export default Service;
