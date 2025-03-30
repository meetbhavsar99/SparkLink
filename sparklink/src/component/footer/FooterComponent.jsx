import React from "react";
import "./FooterComponent.css";
import UWindsor_logo from "../../assets/UWindsor-footer-logo.svg";

const FooterComponent = () => {
  return (
    <div className="footer-container">
      <div className="container-fluid footer-background">
        <div className="footer-content">
          <div className="col-lg-3 col-md-3 col-sm-12 px-4">
            <img
              src={UWindsor_logo}
              alt="Logo"
              className="UWindsor-footer-logo"
            />
          </div>
          <div className="col-lg-5 col-md-5 col-sm-12 text-footer text-center">
            Innovate and Transform
            <br />
            with UWindsor SparkLink
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
