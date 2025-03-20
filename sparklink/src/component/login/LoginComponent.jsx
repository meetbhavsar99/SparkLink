import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./LoginComponent.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "../../AuthContext";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { user, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access query parameters

  useEffect(() => {
    // Extract message query parameter from URL
    const params = new URLSearchParams(location.search);
    const message = params.get("message");

    if (message) {
      setSuccessMessage(message);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target; // Get the form element

    // Check if form is valid
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated"); // Show validation feedback
        return;
    }

    try {
        const response = await axios.post("/api/users/login", {
            email: email.trim(),
            password: password.trim(),
        }, {
            withCredentials: true,
        });

        if (response.data.is_confirmed === 0) {
            setErrorMessage("Please confirm your email before logging in.");
            return;
        }

        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate("/", { replace: true });

        form.classList.remove("was-validated"); // Reset validation after successful login
    } catch (error) {
        // Always return a generic error message for invalid credentials
        setErrorMessage("Invalid credentials. Please try again.");
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
            <form className="form needs-validation" noValidate onSubmit={handleLogin}>
              <h2 className="form-title">Sign in</h2>

              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className={`email_field form-control form-control-lg ${email ? "is-valid" : "is-invalid"}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value);
                  e.target.classList.remove("is-invalid");
                  e.target.classList.add(e.target.checkValidity() ? "is-valid" : "is-invalid");
                  }}
                  placeholder="Email address"
                  required
                />
                {/* <div className="valid-feedback">Looks good!</div> */}
                <div className="invalid-feedback">Please provide a valid email.</div>
              </div>

              <div data-mdb-input-init className="form-outline mb-4 position-relative ">
                <input
                  type={showPassword ? "text" : "password"}  // Toggle input type between text and password
                  id="form3Example4"
                  className={`password_field form-control form-control-lg ${password ? "is-valid" : "is-invalid" }`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value);
                  e.target.classList.remove("is-invalid");
                  e.target.classList.add(e.target.checkValidity() ? "is-valid" : "is-invalid");
                  }}
                  placeholder="Password"
                  required
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}  // FontAwesome eye icon
                  style={{ right: 10, top: 17, cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
                ></i>
                {/* <div className="valid-feedback">Looks good!</div> */}
                <div className="invalid-feedback">Password is required.</div>
              </div>





              <div className="d-flex justify-content-between align-items-center  mt-4 pt-2">
              <div className="text-center text-lg-start">
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="submit-button button_text button-card"
                >
                  Login
                </button>
                </div>
                <a href="/reset-password-email" className=" text-end">
                  Forgot password?
                </a>
              </div>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <a href="/register" className="link-danger">Register</a>
              </p>

              {/* Contact Us Button */}
              <p className="small fw-bold mt-2 pt-1 mb-0">
                  Need help?{" "}
                  <a href="/contact" className="link-primary">Contact Us</a>
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
