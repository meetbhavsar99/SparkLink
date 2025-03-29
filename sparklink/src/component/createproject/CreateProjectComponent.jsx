import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase_script";
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useNotification } from "../../notificationContext";
import Swal from "sweetalert2";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
  const { updateNotifyCount } = useNotification();
  const [otherPurposeText, setOtherPurposeText] = useState("");
  const [otherProductText, setOtherProductText] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState([]);
  const [otherPurpose, setOtherPurpose] = useState("");
  const [product, setProduct] = useState([]);
  const [otherProduct, setOtherProduct] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [featuresNA, setFeaturesNA] = useState(false);
  const [projectDeadline, setProjectDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [numStudents, setNumStudents] = useState("");
  const [numStudentsNA, setNumStudentsNA] = useState(false);
  const [skillsRequired, setSkillsRequired] = useState("");
  const [skillsNA, setSkillsNA] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isAuthenticated, user } = useAuth();
  const [isValidated, setIsValidated] = useState(false);

  const purposeOptions = [
    { value: "E-Commerce", label: "E-Commerce" },
    { value: "Social Media", label: "Social Media" },
    { value: "Internal Tool", label: "Internal Tool" },
    { value: "Other", label: "Other" },
  ];

  const productOptions = [
    { value: "Website", label: "Website" },
    { value: "Android App", label: "Android App" },
    { value: "iOS App", label: "iOS App" },
    { value: "Windows Software", label: "Windows Software" },
    { value: "Other", label: "Other" },
  ];

  const categoryOptions = [
    { value: "AI", label: "AI & Machine Learning" },
    { value: "Web Development", label: "Web Development" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "Data Science", label: "Data Science" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "12px",
      border: "1px solid rgba(106, 106, 106, 0.3)",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
      padding: "5px",
      background: "rgba(255, 255, 255, 0.7)",
      "&:hover": {
        borderColor: "#6a85b6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgba(106, 133, 182, 0.9)"
        : state.isFocused
        ? "rgba(106, 133, 182, 0.2)"
        : "transparent",
      color: state.isSelected ? "white" : "#333",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
    }),
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setImageFile(acceptedFiles[0]),
  });

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const emptyForm = () => {
    setProjectName("");
    setPurpose([]);
    setOtherPurpose("");
    setProduct([]);
    setOtherProduct("");
    setProjectBudget("");
    setProjectDescription("");
    setFeatures("");
    setProjectDeadline("");
    setCategory("");
    setNumStudents("");
    setSkillsRequired("");
    setImageFile(null);
  };

  const handleNAChange = (field) => {
    if (field === "features") {
      setFeaturesNA(!featuresNA);
      if (!featuresNA) setFeatures("");
    }
    if (field === "students") {
      setNumStudentsNA(!numStudentsNA);
      if (!numStudentsNA) setNumStudents("");
    }
    if (field === "skills") {
      setSkillsNA(!skillsNA);
      if (!skillsNA) setSkillsRequired("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidated(true);
    const form = e.target;
    if (!form.checkValidity() || purpose.length === 0 || product.length === 0 || !projectDeadline) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const form_data = {
        project_name: projectName,
        purpose: purpose.join(", "),
        product: product.join(", "),
        project_budget: projectBudget,
        project_description: projectDescription,
        category,
        features: featuresNA ? "N/A" : features,
        project_deadline: projectDeadline,
        skills_required: skillsNA ? "N/A" : skillsRequired,
        num_students: numStudentsNA ? null : parseInt(numStudents, 10) || null,
        image_url: imageFile ? imageFile.name : "",
        user_id: user.user_id,
      };

      const response = await axios.post("/project", form_data);
      if (response) {
        await axios.post("/api/notifications/project-created", {
          project_name: projectName,
          supervisor_email: user.email,
        });
        Swal.fire({
          title: "Success",
          text: "Project Created Successfully & Emails Sent",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#6a85b6",
          customClass: {
            popup: "glass-swal-popup",
            title: "swal-title",
            confirmButton: "swal-confirm-button",
          },
        });
        updateNotifyCount();
        emptyForm();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response ? error.response.data.message : error.message,
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#6a85b6",
        customClass: {
          popup: "glass-swal-popup",
          title: "swal-title",
          confirmButton: "swal-confirm-button",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createproject-page">
      <div className="container-fluid flex-grow-1">
        <MenuComponent />
        <div className="row">
          <MasterComponent />
          <div className="col-11 ml-custom">
            <div className="progress-tracker">
              <div className="createproject_Heading">
                <span className="createproject_title">Tell us about your project</span>
              </div>
              <div className="createproject_layout">
                <div className="createproject_form">
                  <form className={`needs-validation ${isValidated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
                    <label className="form_label">
                      What is the name of your project?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={projectName}
                      placeholder="Please enter the project name..."
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        e.target.classList.remove("is-invalid");
                        e.target.classList.add(e.target.checkValidity() ? "is-valid" : "is-invalid");
                      }}
                      maxLength={150}
                      required
                    />
                    <div className="invalid-feedback">Project name is required.</div>

                    <label className="form_label">
                      What is the main purpose of the product?
                      <span className="text-danger"> *</span>
                    </label>
                    <Select
                      isMulti
                      name="purpose"
                      className={`margin-down ${isValidated && purpose.length === 0 ? "is-invalid" : ""}`}
                      options={purposeOptions}
                      styles={customSelectStyles}
                      value={purpose.map((p) => ({ value: p, label: p }))}
                      onChange={(selected) => {
                        setPurpose(selected.map((s) => s.value));
                      }}
                    />
                    <div className="invalid-feedback">Please select at least one purpose.</div>

                    {purpose.includes("Other") && (
                      <input
                        type="text"
                        className="margin-down"
                        placeholder="Specify other purpose"
                        value={otherPurpose}
                        onChange={(e) => setOtherPurpose(e.target.value)}
                      />
                    )}

                    <label className="form_label">
                      What type of product do you want to build?
                      <span className="text-danger"> *</span>
                    </label>
                    <Select
                      isMulti
                      name="product"
                      className={`margin-down ${isValidated && product.length === 0 ? "is-invalid" : ""}`}
                      options={productOptions}
                      styles={customSelectStyles}
                      value={product.map((p) => ({ value: p, label: p }))}
                      onChange={(selected) => {
                        setProduct(selected.map((s) => s.value));
                      }}
                    />
                    <div className="invalid-feedback">Please select at least one product type.</div>

                    {product.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Specify other product"
                        className="margin-down"
                        value={otherProduct}
                        onChange={(e) => setOtherProduct(e.target.value)}
                      />
                    )}

                    <label className="form_label">
                      What is your estimated budget for this project (in CAD)?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="project_budget"
                      value={projectBudget}
                      onChange={(e) => {
                        setProjectBudget(e.target.value);
                        e.target.classList.add(e.target.checkValidity() ? "is-valid" : "is-invalid");
                      }}
                      placeholder="Enter your budget"
                      min="1"
                      required
                    />
                    <div className="invalid-feedback">Budget must be a positive number.</div>

                    <label className="form_label">
                      Please provide a brief description of your product:
                      <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      name="project_Description"
                      className="form_textarea"
                      value={projectDescription}
                      onChange={(e) => {
                        setProjectDescription(e.target.value);
                        e.target.classList.add(e.target.checkValidity() ? "is-valid" : "is-invalid");
                      }}
                      placeholder="Please enter the brief description for this project"
                      style={{ height: "120px", width: "75%" }}
                      maxLength={250}
                      required
                    />
                    <div className="invalid-feedback">Project description is required.</div>

                    <label className="form_label">
                      Please select a category for this project?
                      <span className="text-danger"> *</span>
                    </label>
                    <Select
                      options={categoryOptions}
                      name="project_category"
                      className="margin-down"
                      styles={customSelectStyles}
                      value={category ? { value: category, label: category } : null}
                      onChange={(selected) => setCategory(selected.value)}
                      required
                    />

                    <div className="feature-section">
                      <label className="form_label">
                        What are the main features or functionalities you want to include in the project?
                      </label>
                      <textarea
                        id="features"
                        name="features"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="Enter features separated by commas (e.g., User login, Sign up)"
                        rows="4"
                        disabled={featuresNA}
                        className={`form_textarea feature-textarea ${featuresNA ? "disabled-textarea" : ""}`}
                      />
                      {user.role === "2" && (
                        <div className="toggle-switch-container">
                          <label className="form_label">Features N/A</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="featuresNA"
                              checked={featuresNA}
                              onChange={() => handleNAChange("features")}
                            />
                            <label className="form-check-label" htmlFor="featuresNA">
                              {featuresNA ? "Enabled" : "Disabled"}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="form_label">
                      What is the expected timeline or deadline for the project completion?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      value={projectDeadline}
                      name="project_deadline"
                      className={`createproject_datepicker date margin-down ${isValidated && !projectDeadline ? "is-invalid" : ""}`}
                      min={today}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please select a valid project deadline.</div>

                    <label className="form_label">
                      Upload file(s) for reference...
                    </label>
                    <div {...getRootProps()} className="dropzone">
                      <input {...getInputProps()} accept=".jpg,.jpeg,.pdf,.png" />
                      {imageFile ? (
                        <p>{imageFile.name}</p>
                      ) : (
                        <p>Drag & drop or click to upload</p>
                      )}
                    </div>

                    <div className="students-section">
                      <label className="form_label">
                        Please enter the number of students you want for this project?
                        <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        className={`margin-down form-control ${numStudentsNA ? "disabled-textarea" : ""}`}
                        value={numStudents}
                        placeholder="Enter number of students..."
                        min="1"
                        onChange={(e) => setNumStudents(e.target.value)}
                        disabled={numStudentsNA}
                      />
                      {user.role === "2" && (
                        <div className="toggle-switch-container">
                          <label className="form_label">Number of Students N/A</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="numStudentsNA"
                              checked={numStudentsNA}
                              onChange={() => handleNAChange("students")}
                            />
                            <label className="form-check-label" htmlFor="numStudentsNA">
                              {numStudentsNA ? "Enabled" : "Disabled"}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="skills-section">
                      <label className="form_label">
                        Please enter the required skills (technology) for this project?
                        <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        value={skillsRequired}
                        className={`margin-down form_textarea ${skillsNA ? "disabled-textarea" : ""}`}
                        style={{ width: "75%" }}
                        placeholder="Enter the skills, and add comma between them..."
                        onChange={(e) => setSkillsRequired(e.target.value)}
                        disabled={skillsNA}
                      />
                      {user.role === "2" && (
                        <div className="toggle-switch-container">
                          <label className="form_label">Skills Required N/A</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="skillsNA"
                              checked={skillsNA}
                              onChange={() => handleNAChange("skills")}
                            />
                            <label className="form-check-label" htmlFor="skillsNA">
                              {skillsNA ? "Enabled" : "Disabled"}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="message">
                      {errorMessage && <div className="error-message">{errorMessage}</div>}
                      {successMessage && <div className="success-message">{successMessage}</div>}
                    </div>
                    <div className="row">
                      <div className="col-12 text-center">
                        <button className="button-home" type="submit">
                          Submit Project
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div className="loading-overlay">
            <div className="text-center">
              <div className="spinner-border text-light" role="status"></div>
              <div className="text-light mt-2">Processing your project...</div>
            </div>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default CreateProjectComponent;
