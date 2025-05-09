import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordComponent.css";
import signupImage from "../../assets/register_icon.png";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";

const ResetPasswordComponent = () => {
  const [tokenValid, setTokenValid] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");
  const [wasValidated, setWasValidated] = useState(false); // Track validation attempt
  const navigate = useNavigate();

  // Verify token on component load
  useEffect(() => {
    console.log("token>>> ", token);
    setTokenValid(false);
    const verifyToken = async () => {
      try {
        await axios.get(`/api/users/reset-password?token=${token}`);

        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        const message =
          error.response?.data?.message || "Token is invalid or expired.";
        setErrorMessage(message);

        // Redirect to /reset-password-email with the error message
        navigate("/reset-password-email", { state: { message } });
      }
    };

    verifyToken();
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setWasValidated(true); // Mark form as validated

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/reset-password", {
        token,
        newPassword,
      });

      setSuccessMessage(response.data.message || "Password reset successful.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div className="loader">Loading...</div>; // Show loader while verifying token
  }
  return (
    <div className="main row-2">
      <section className="vh-100">
        <div className="container-fluid">
          <div className="row heading-register text-end">
            <Link to="/">
              <img src={sparklink_logo} alt="Logo" className="sparklink_logo" />
            </Link>
          </div>
          <div className="row d-flex justify-content-center align-items-center h-100">
            {tokenValid ? (
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form
                  className={`reset-password-form needs-validation ${
                    wasValidated ? "was-validated" : ""
                  }`}
                  noValidate
                  onSubmit={handlePasswordReset}
                >
                  <h2 className="form-title">Enter New Password</h2>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <input
                      type="password"
                      className={`form-control form-control-lg${
                        wasValidated && !newPassword ? "is-invalid" : "is-valid"
                      }`}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMessage(""); // Clear error message on input
                      }}
                      required
                    />
                    <div className="invalid-feedback">
                      Password is required.
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div data-mdb-input-init className="form-outline mb-4">
                    <input
                      type="password"
                      className={`form-control form-control-lg${
                        wasValidated && !confirmPassword
                          ? "is-invalid"
                          : confirmPassword === newPassword
                          ? "is-valid"
                          : "is-invalid"
                      }`}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMessage(""); // Clear error message on input
                      }}
                      required
                    />
                    <div className="invalid-feedback">
                      Passwords do not match.
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )}

                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button
                      type="submit"
                      className="button_text button-card btn-block"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Reset Password"}
                    </button>
                    {true && (
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Try Login?{" "}
                        <Link to="/login" className="link-success">
                          Click here
                        </Link>
                      </p>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <div className="alert alert-danger">{errorMessage}</div>
              </div>
            )}

            {/* Image Section */}
            <div className="signup-image col-md-9 col-lg-6 col-xl-5">
              <img
                src={signupImage}
                className="img-fluid"
                alt="Reset password visual"
              />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
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
      </section>
    </div>
  );
};
export default ResetPasswordComponent;
