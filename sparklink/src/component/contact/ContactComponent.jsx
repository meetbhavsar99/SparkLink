// ContactComponent.jsx
import React, { useState } from "react";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import "./ContactComponent.css";

const ContactComponent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    try {
      const response = await fetch("http://localhost:3100/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmissionStatus(`Your request has been submitted successfully! Token ID: ${result.tokenId}`);
        alert(`Your request has been submitted successfully!\nToken ID: ${result.tokenId}\nCheck your email for confirmation.`);
        setFormData({ name: "", email: "", message: "" });
        form.classList.remove("was-validated");
      } else {
        setSubmissionStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      <MenuComponent />
      <MasterComponent />

      {/* 
        1) A 'middle' wrapper that stretches to fill leftover space
           so the footer can remain at the bottom on large screens.
      */}
      <div className="contact-main">
        <div className="contact-container">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-description">Have any questions? We’d love to hear from you.</p>

          <div className="contact-info">
            <p className="contact-item">
              <i className="fas fa-envelope"></i> olena.syrotkina@uwindsor.ca
            </p>
            <p className="contact-item">
              <i className="fas fa-map-marker-alt"></i> University of Windsor
              <br /> 401 Sunset Ave, Windsor, ON N9B 3P4
            </p>
          </div>

          <form className="needs-validation contact-form" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control contact-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please provide a name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control contact-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please provide an email.</div>
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="form-label">Your Message</label>
              <textarea
                name="message"
                id="message"
                className="form-control contact-input"
                placeholder="Enter your message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please provide a message.</div>
            </div>

            <button type="submit" className="send-button w-100">Send Message</button>
          </form>

          {submissionStatus && (
            <p className="submission-status text-center mt-3">{submissionStatus}</p>
          )}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default ContactComponent;
