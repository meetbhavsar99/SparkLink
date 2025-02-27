import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone"; // Drag and drop
import Select from "react-select"; // Multi-select dropdown
import { WithContext as ReactTags } from "react-tag-input"; // Tags input
import axios from "axios";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import Swal from "sweetalert2";
import { useAuth } from "../../AuthContext";
import { useNotification } from "../../notificationContext";
import "./CreateProjectComponent.css";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
  const { updateNotifyCount } = useNotification();
  const { user } = useAuth();

  // State Variables
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState([]);
  const [otherPurpose, setOtherPurpose] = useState("");
  const [product, setProduct] = useState([]);
  const [otherProduct, setOtherProduct] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [projectDeadline, setProjectDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [numStudents, setNumStudents] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [revealDetails, setRevealDetails] = useState(false);
  const [estimatedSalary, setEstimatedSalary] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Error and Success Messages
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Dropdown options
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

  // Drag-and-Drop Image Upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setImageFile(acceptedFiles[0]),
  });

  // Tags Input Handlers
  const handleDeleteFeature = (i) =>
    setFeatures(features.filter((_, index) => index !== i));
  const handleAddFeature = (tag) => setFeatures([...features, tag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form Data State:", {
      projectName,
      purpose,
      product,
      minBudget,
      maxBudget,
      category,
      features,
      projectDeadline,
      skillsRequired,
      numStudents,
      revealDetails,
      estimatedSalary,
    });
  
    const form_data = {
      project_name: projectName,
      purpose: purpose.join(", "),
      product: product.join(", "),
      min_budget: minBudget,
      max_budget: maxBudget,
      category,
      features: features.map((tag) => tag.text),
      project_deadline: projectDeadline,
      required_skills: skillsRequired,
      number_of_students: numStudents,
      reveal_identity: revealDetails,
      description: projectDescription,
      image_url: imageFile ? imageFile.name : "",
      estimated_salary: revealDetails ? estimatedSalary : null,
    };

  
    try {
      console.log("localStorage:", localStorage);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }
      console.log("Token:", token);
      const response = await axios.post("http://localhost:3100/project", form_data, {
        headers: {
          //Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token
          Authorization: `Bearer ${token}`, // Send token
        },
      });
  
      console.log("Project created successfully:", response.data);
      Swal.fire("Success", "Project created successfully!", "success");
    } catch (error) {
      console.error("Error creating project:", error.response?.data?.message || error.message);
      Swal.fire("Error", error.response?.data?.message || "Failed to create project", "error");
    }
  };
  


  return (
    <>
      <div className="container-fluid">
        <MenuComponent />
        <div className="row">
          <MasterComponent />
          <div className="col-1"></div>
          <div className="col-11">
            <div className="progress-tracker">
              <div className="createproject_Heading">
                <span>Tell us about your project</span>
              </div>
              <div className="createproject_layout">
                {/* Display error and success messages */}

                <div className="createproject_form"></div>
              <form onSubmit={handleSubmit}>
                {/* Project Name */}
                <label className="form_label">
                  1. What is the name of your project?
                  <span className="text-danger"> *</span>
                  </label>
                <input
                  type="text"
                  className="margin-down"
                  name="project_name"
                  placeholder="Please enter the project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  maxLength={150}
                  style={{ width: '400px' }}
                  required
                />

                {/* Purpose */}
                <label className="form_label">
                2. What is the main purpose of the product?
                <span className="text-danger"> *</span>
                </label>
                <Select
                  isMulti
                  name="purpose"
                  className="margin-down"
                  options={purposeOptions}
                  onChange={(selected) =>
                    setPurpose(selected.map((s) => s.value))
                  }
                />
                {purpose.includes("Other") && (
                  <input
                    type="text"
                    className="margin-down"
                    placeholder="Specify other purpose"
                    value={otherPurpose}
                    onChange={(e) => setOtherPurpose(e.target.value)}
                  />
                )}

                {/* Product */}
                <label className="form_label">
                3. What type of product do you want to build?
                <span className="text-danger"> *</span>
                </label>
                <Select
                  isMulti
                  name="product"
                  className="margin-down"
                  options={productOptions}
                  onChange={(selected) =>
                    setProduct(selected.map((s) => s.value))
                  }
                />
                {product.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Specify other product"
                    className="margin-down"
                    value={otherProduct}
                    onChange={(e) => setOtherProduct(e.target.value)}
                  />
                )}

                {/* Budget */}
                <label className="form_label">
                4. What is your estimated budget for this project (in
                  CAD)?
                  <span className="text-danger"> *</span>
                </label>
                <input
                  type="number"
                  className="margin-down"
                  placeholder="Minimum Budget"
                  name="min_project_budget"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  required
                />
                <span>  to  </span>
                <input
                  type="number"
                  placeholder="Maximum Budget"
                  className="margin-down"
                  name="max_project_budget"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                />
            
                {/* Description */}
                <label className="form_label">
                5. Please provide a brief description of your product:
                <span className="text-danger"> *</span>
                </label>
                <textarea
                  value={projectDescription}
                  className="margin-down"
                  style={{ width: '400px', height: '100px'}}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Please enter the brief description for this project"
                  required
                />

                {/* Category */}
                <label className="form_label">
                6. Please select a category for this project?
                <span className="text-danger"> *</span>
                      </label>
                <Select
                  options={categoryOptions}
                  name="project_Description"
                  className="margin-down"
                  onChange={(selected) => setCategory(selected.value)}
                  required
                />

                {/* Features */}
                <label className="form_label">
                7. What are the main features or functionalities you want to include in the project?
                {/* <span className="text-danger"></span> */}
                </label>
                <ReactTags
                  tags={features}
                  handleDelete={handleDeleteFeature}
                  handleAddition={handleAddFeature}
                  placeholder="Add a feature and hit enter to add more..."
                />

                {/* Deadline */}
                <label className="form_label margin-top">
                8. What is the expected timeline or deadline for the project completion?
                <span className="text-danger"> *</span>
                </label>
                <input
                  type="date"
                  value={projectDeadline}
                  name="project_deadline"
                  className="createproject_datepicker date margin-down"
                  min={today}
                  onChange={(e) => setProjectDeadline(e.target.value)}
                  required
                />

                {/* Image Upload */}
                <label className="form_label">
                9. Upload image(s) for reference...</label>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <p>{imageFile.name}</p>
                  ) : (
                    <p className="margin-down">Drag & drop or click to upload</p>
                  )}
                </div>

                {/* Number of Students */}
                <label className="form_label">
                10. Please enter the number of student you want for this project? 
                <span className="text-danger"> *</span>
                </label>
                <input
                  type="number"
                  className="margin-down"
                  value={numStudents}
                  placeholder="Enter number of students..."
                  onChange={(e) => setNumStudents(e.target.value)}
                  required
                />

                {/* Skills Required */}
                <label className="form_label">
                11. Please enter the required skills (technology) for this project?
                <span className="text-danger"> *</span>
                </label>
                <textarea
                  value={skillsRequired}
                  className="margin-down"
                  style={{ width: '400px' }}
                  placeholder="Enter the skills, and add comma betweeen them..."
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  required
                />

                {/* Reveal Name/Company */}
                <label className="form_label">
                  12. Do you want to reveal your details to the students?
                </label>
                <select
                  value={revealDetails}
                  className="margin-down"
                  onChange={(e) => setRevealDetails(e.target.value === "true")}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                {/* Estimated Salary */}
                {revealDetails && (
                  <>
                    <label className="form_label">
                      What will be the estimated salary will be per hour?
                    </label>
                    <input
                      type="number"
                      className="margin-down"
                      style={{ width: '400px' }}
                      placeholder="Please enter estimated salary per hour..."
                      value={estimatedSalary}
                      onChange={(e) => setEstimatedSalary(e.target.value)}
                    />
                  </>
                )}

                {/* Submit Button */}
                <br />
                <button type="submit">Submit</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
              </form>
              </div>
            </div>
          </div>
        </div>
        {loading && <div className="loading-overlay margin-down">Processing...</div>}
        <FooterComponent />
      </div>
    </>
  );
};

export default CreateProjectComponent;
