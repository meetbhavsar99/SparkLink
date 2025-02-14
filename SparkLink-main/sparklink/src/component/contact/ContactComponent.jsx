import React, { useState } from "react";
//import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is imported
import MasterComponent from "../MasterComponent";
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';

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
            
            // Show success message with token ID
            alert(`Your request has been submitted successfully!\nToken ID: ${result.tokenId}\nCheck your email for confirmation.`);

            // Reset the form after successful submission
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
      <MenuComponent></MenuComponent>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="shadow-lg p-4">
              <h2 className="text-center text-primary">Contact Us</h2>
              <p className="text-center text-muted">
                Have any questions? We’d love to hear from you.
              </p>

              <div className="mb-4">
                <p>
                  <i className="fas fa-envelope text-primary"></i>{" "}
                  support@sparklink.com(bhavsa35@uwindsor.ca)
                </p>
                <p>
                  <i className="fas fa-map-marker-alt text-danger"></i>{" "}
                  University of Windsor <br/>
                  401 Sunset Ave, Windsor, ON N9B 3P4
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                </div>

                <button type="submit" className="btn btn-primary w-100">
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
