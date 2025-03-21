import React, { useState } from "react";
import "./ResetPasswordEmailComponent.css";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import signupImage from "../../assets/signup-image.jpg";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";

const ResetPasswordEmailComponent = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(
    location.state?.message || ""
  );
  const [wasValidated, setWasValidated] = useState(false); // Controls validation display

  const handleEmail = async (e) => {
    e.preventDefault();

    setWasValidated(true); // Show validation styles
    // Validate email before submitting
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/users/forgot-password", {
        email: email,
      });

      setSuccessMessage(
        "A password reset link has been sent to your registered email address. Please check your inbox."
      );
      setErrorMessage("");
      setWasValidated(false); // Reset validation on success
    } catch (error) {
      console.log("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Provided email address is not associated with an account. Please verify the email address and try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row heading-login">
          <Link to="/">
            <img src={sparklink_logo} alt="Logo" className="sparklink_logo" />
          </Link>
        </div>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            ></img>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            <form className={`form needs-validation ${wasValidated ? "was-validated" : ""}`} noValidate onSubmit={handleEmail}>
              <h2 className="form-title"> Enter Your Email </h2>

              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className={`email_field form-control form-control-lg${wasValidated && (!email || !email.includes("@")) ? "is-invalid" : email ? "is-valid" : ""}`}
                  value={email}
                  onChange={(e) => {
                     setEmail(e.target.value);
        setErrorMessage(""); // Remove error when typing
                     }}
                  placeholder="Email address"
                  required
                />
                <div className="invalid-feedback">Please enter a valid email.</div>
              </div>


              <div className="d-flex justify-content-between align-items-center  mt-4 pt-2">
              <div className="text-center text-lg-start">
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="submit-button button_text button-card"
                >
                  Submit
                </button>
                </div>
              </div>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Do you have an account?{" "}
                <a href="/register" className="link-primary">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      {loading && (
          <div className="loading-overlay d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div
                className="spinner-border text-light"
                style={{ width: "5rem", height: "5rem" }}
                role="status"
              ></div>
              <div className="text-light mt-2">Processing...</div>
            </div>
          </div>
        )}
    </section>  );
};
export default ResetPasswordEmailComponent;
