import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./RegisterComponent.css";
import sparklink_icon from "../../assets/SparkLink_icon.png";
import backgroundImage from "../../assets/background3.jpg";
import signupImage from "../../assets/signup_icon.png";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const RegistrationForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const location = useLocation();
  const [secret, setSecret] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const querySecret = params.get("q");

    if (querySecret) {
      setSecret(querySecret);

      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target; // Get the form element

    setIsValidated(true); // Set flag to show validation

    // Check if form is valid
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated"); // Show validation feedback
      return; // Stop execution if form is invalid
    }

    console.log("Submitting registration form...");
    console.log("Sending Data:", {
      username,
      email,
      password,
      confirmPassword,
      name,
      role,
    });

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if ((role === "3" || role === "4") && !email.endsWith("@uwindsor.ca")) {
      setErrorMessage("Email should end with @uwindsor.ca");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", {
        username,
        email,
        password,
        confirmPassword,
        name,
        role,
        secret,
      });

      setSuccessMessage(
        "Registration successful! Please check your email to confirm your account."
      );

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      setErrorMessage("");
      form.classList.remove("was-validated"); // Reset validation styling after successful submission
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const SUPERVISOR_SECRET = "secret123";
  const ADMIN_SECRET = "admin456";

  const getAllowedRoles = () => {
    if (secret === ADMIN_SECRET) {
      return [
        { value: "1", label: "Admin" },
        { value: "2", label: "Business Owner" },
        { value: "3", label: "Supervisor" },
        { value: "4", label: "Student" },
      ];
    } else if (secret === SUPERVISOR_SECRET) {
      return [
        { value: "2", label: "Business Owner" },
        { value: "3", label: "Supervisor" },
        { value: "4", label: "Student" },
      ];
    } else {
      return [{ value: "4", label: "Student" }];
    }
  };

  const allowedRoles = getAllowedRoles();

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
            {/* Form Section */}
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form
                className={`register-form needs-validation ${
                  isValidated ? "mb-5" : ""
                }`} // adds margin if validated
                id="register-form"
                noValidate
                onSubmit={handleSubmit}
              >
                <h2 className="form-title">Sign up</h2>

                {/* Name Field */}

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    className={`form-control form-control-lg ${
                      isValidated && !username ? "is-invalid" : ""
                    }`}
                    placeholder="First Name"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please provide your first name.
                  </div>
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`form-control form-control-lg ${
                      isValidated && !name ? "is-invalid" : ""
                    }`}
                    placeholder="Last Name"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please provide your last name.
                  </div>
                </div>
                {/* Email Field */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className={`form-control form-control-lg ${
                      isValidated && !email ? "is-invalid" : ""
                    }`}
                    placeholder="Your Email"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please provide a valid email.
                  </div>
                </div>
                {/* Password Field */}
                <div
                  data-mdb-input-init
                  className="form-outline mb-4  position-relative"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    id="pass"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className={`form-control form-control-lg ${
                      isValidated && !password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    required
                  />
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } position-absolute`} // FontAwesome eye icon
                    style={{ right: 34, top: 17, cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  ></i>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Password is required.</div>
                </div>
                {/* Repeat Password Field */}
                <div
                  data-mdb-input-init
                  className="form-outline mb-4 position-relative"
                >
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="re_pass"
                    id="re_pass"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    className={`form-control form-control-lg ${
                      isValidated &&
                      (!confirmPassword || confirmPassword !== password)
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Repeat your password"
                    required
                  />
                  <i
                    className={`fas ${
                      showPassword2 ? "fa-eye-slash" : "fa-eye"
                    } position-absolute`} // FontAwesome eye icon
                    style={{ right: 34, top: 17, cursor: "pointer" }}
                    onClick={() => setShowPassword2(!showPassword2)} // Toggle password visibility
                  ></i>
                  <div className="valid-feedback">Passwords match!</div>
                  <div className="invalid-feedback">Passwords must match.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="roleSelect" className="form-label">
                    Roles
                  </label>
                  {/* <select
                    id="roleSelect"
                    className={`form-select ${isValidated && !role ? "is-invalid" : "" }`} 
                    value={role} // Assuming `selectedRole` is the state holding the selected role
                    onChange={(e) => setRole(e.target.value)} // Update state on selection
                    required
                  >
                    <option value="" disabled>
                      Select a Role
                    </option>
                    <option value="2">Business Owner</option>
                    <option value="3">Supervisor</option>
                    <option value="4">Student</option>
                  </select> */}
                  <select
                    id="roleSelect"
                    className={`form-select ${
                      isValidated && !role ? "is-invalid" : ""
                    }`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a Role
                    </option>
                    {allowedRoles.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>

                  <div className="invalid-feedback">Please select a role.</div>
                </div>
                {/* Submit Button */}
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    name="signup"
                    id="signup"
                    className="button_text button-card"
                  >
                    Register
                  </button>
                  <Link to="/login" className="login-link">
                    I am already a member
                  </Link>
                </div>

                {/* Contact Us Button */}
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Need help?{" "}
                  <a
                    href="/contact"
                    className="link-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                  >
                    Contact Us
                  </a>
                </p>
              </form>
            </div>
            {/* Image Section */}

            <div className="signup-image col-md-9 col-lg-6 col-xl-5">
              <img
                src={signupImage}
                className="img-fluid signup-icon"
                alt="Sign up image"
              ></img>
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
      </section>
    </div>
  );
};

export default RegistrationForm;
