import React, { useState } from "react";
//import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is imported
import MasterComponent from "../MasterComponent";
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';

import './ContactComponent.css';


const ContactComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target; // Get the form element

    // Check if form is valid
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return; // Stop execution if form is invalid
    }

    try {
      const response = await fetch("http://localhost:3100/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmissionStatus("✅ Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        form.classList.remove("was-validated"); // Reset validation styling
      } else {
        setSubmissionStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <MasterComponent />
      <MenuComponent></MenuComponent>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="shadow-lg p-4 mb-5">
              <h2 className="text-center contact-title">Contact Us</h2>
              <p className="text-center text-muted">
                Have any questions? We’d love to hear from you.
              </p>

              <div className="mb-4">
                <p>
                  <i className="fas fa-envelope contact-icon"></i>{" "}
                  olena.syrotkina@uwindsor.ca
                </p>
                <p>
                  <i className="fas fa-phone text-success"></i> (519) 253-3000
                </p>
                <p>
                  <i className="fas fa-map-marker-alt text-danger"></i> 401 Sunset Ave, Windsor, ON N9B 3P4
                </p>
              </div>

              <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label for="name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Please provide a name.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Please provide an email.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Enter your message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Please provide a message.
                  </div>
                </div>

                <button type="submit" className="btn send-button w-100">
                  Send Message
                </button>
              </form>

              {submissionStatus && (
                <p className="mt-3 text-center text-success">{submissionStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <FooterComponent></FooterComponent>
    </>
  );
};

export default ContactComponent;
