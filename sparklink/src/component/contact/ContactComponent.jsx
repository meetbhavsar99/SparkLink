import React, { useState } from "react";
import MasterComponent from "../MasterComponent";
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import "./ContactComponent.css";

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
    try {
      const response = await fetch("http://localhost:3100/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmissionStatus(`✅ Your request has been submitted successfully! Token ID: ${result.tokenId}`);
        alert(`Your request has been submitted successfully!\nToken ID: ${result.tokenId}\nCheck your email for confirmation.`);
        setFormData({ name: "", email: "", message: "" });
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
      <MenuComponent />
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-description">Have any questions? We’d love to hear from you.</p>

        <div className="contact-info">
          <p className="contact-item">
            <i className="fas fa-envelope"></i> support@sparklink.com (bhavsa35@uwindsor.ca)
          </p>
          <p className="contact-item">
            <i className="fas fa-map-marker-alt"></i> University of Windsor <br /> 401 Sunset Ave, Windsor, ON N9B 3P4
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            className="contact-input"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Your Email</label>
          <input
            type="email"
            name="email"
            className="contact-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Your Message</label>
          <textarea
            name="message"
            className="contact-input"
            placeholder="Enter your message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="send-button">Send Message</button>
        </form>

        {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
      </div>
      <FooterComponent />
    </>
  );
};

export default ContactComponent;
