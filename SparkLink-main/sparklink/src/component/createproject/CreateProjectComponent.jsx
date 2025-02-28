import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  // getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase imports
import { storage } from "../../firebase_script"; // Your Firebase config file
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from '../MasterComponent';
import FooterComponent from "../footer/FooterComponent";
import Select from "react-select"; // Multi-select dropdown
import { WithContext as ReactTags } from "react-tag-input"; // Tags input
import axios from "axios";
import { useAuth } from '../../AuthContext';
import { useNotification } from "../../notificationContext";
import Swal from "sweetalert2";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
  const { updateNotifyCount } = useNotification();

  // const [isOtherPurposeChecked, setIsOtherPurposeChecked] = useState(false);
  // const [isOtherProductChecked, setIsOtherProductChecked] = useState(false);
  const [otherPurposeText, setOtherPurposeText] = useState("");
  const [otherProductText, setOtherProductText] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  // Form states
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState([]);
  const [otherPurpose, setOtherPurpose] = useState("");
  const [product, setProduct] = useState([]);
  const [otherProduct, setOtherProduct] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  // const [features, setFeatures] = useState("");
  const [features, setFeatures] = useState([]); // Each feature will have { id, text }
  const [projectDeadline, setProjectDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [numStudents, setNumStudents] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  // const [previousImageUrl, setPreviousImageUrl] = useState(""); // Store previously uploaded image URL

  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

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


  useEffect(() => {
    console.log("the user logged in is", user)
  })

  // const handlePurposeCheckBoxChange = (e) => {
  //   const { checked, value } = e.target;
  //   if (checked) {
  //     if (value === "Other") {
  //       setIsOtherPurposeChecked(checked);
  //       return;
  //     }
  //     setPurpose([...purpose, value]);
  //   } else {
  //     if (value === "Other") {
  //       setIsOtherPurposeChecked(false);
  //       setPurpose((prevPurpose) =>
  //         prevPurpose.filter((p) => p !== otherPurposeText) // Remove "Other" from purpose
  //       );
  //       setOtherPurposeText("");
  //       return;
  //     }
  //     setPurpose(purpose.filter((p) => p !== value));
  //   }
  // };

  // const handleOtherPurposetextChange = (e) => {
  //   const text = e.target.value;
  //   setOtherPurposeText(text);
  //   if (setIsOtherPurposeChecked) {
  //     setPurpose((prevPurpose) => {
  //       const filteredPurpose = prevPurpose.filter(
  //         (p) => p !== otherPurposeText
  //       );
  //       return [...filteredPurpose, text];
  //     });
  //   }
  // };

  // const handleProductCheckBoxChange = (e) => {
  //   const { checked, value } = e.target;

  //   if (checked) {
  //     if (value === "Other") {
  //       setIsOtherProductChecked(true);
  //       return;
  //     }
  //     setProduct((prevProduct) => [...prevProduct, value]);
  //   } else {
  //     if (value === "Other") {
  //       setIsOtherProductChecked(false);
  //       setProduct((prevProduct) =>
  //         prevProduct.filter((p) => p !== otherProductText)
  //       );
  //       setOtherProductText("");
  //       return;
  //     }
  //     setProduct((prevProduct) => prevProduct.filter((p) => p !== value));
  //   }
  // };


  // const handleOtherProducttextChange = (e) => {
  //   const text = e.target.value;
  //   setOtherProductText(text);
  //   if (setIsOtherProductChecked) {
  //     setProduct((prevProduct) => {
  //       // Remove any existing "other" text first, then add the new one
  //       const filteredProduct = prevProduct.filter(
  //         (p) => p !== otherProductText
  //       );
  //       return [...filteredProduct, text];
  //     });
  //   }
  // };

  // Handle image change
  // const handleImageChange = (e) => {
  //   setImageFile(e.target.files[0]); // Set the selected image file
  // };

  const emptyForm = () => {
    setProjectName("");
    setPurpose([]);
    setProduct([]);
    setProjectBudget("");
    setProjectDescription("");
    setFeatures("");
    setProjectDeadline("");
  };

  // const imageNames = [
  //   "photo1",
  //   "photo2",
  //   "photo3",
  //   "photo4",
  //   "photo5",
  //   "photo6",
  //   "photo7",
  //   "photo8",
  //   "photo9",
  //   "photo10",
  // ];

  // Function to get a random image name
  // const getRandomImageName = () => {
  //   const randomIndex = Math.floor(Math.random() * imageNames.length);
  //   return randomIndex;
  // };

  // Tags Input Handlers
  const handleDeleteFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index)); // Remove the feature at the given index
  };    
  const handleAddFeature = (tag) => {
    const newFeature = { id: tag.id || tag, text: tag.text || tag };
    console.log("Adding Feature:", newFeature);
    setFeatures([...features, newFeature]);
  };
  
  
  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Features before submission:", features);

    console.log("Form Data State:", {
      projectName,
      purpose,
      product,
      projectBudget,
      projectDescription,
      category,
      features,
      projectDeadline,
      skillsRequired,
      numStudents,
      imageFile
    });

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(false);

    // if (setIsOtherPurposeChecked) {
    //   setPurpose((prevPurpose) => [...prevPurpose, otherPurposeText]);
    //   console.log("purpose --- > " + purpose);
    // }

    // Basic form validation
    if (
      !projectName ||
      !purpose.length ||
      !product.length ||
      !projectBudget ||
      !projectDescription ||
      !features ||
      !projectDeadline
    ) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const form_data = {
      project_name: projectName,
      purpose: purpose.join(", "),
      product: product.join(", "),
      project_budget: projectBudget,
      project_description: projectDescription,
      category,
      features, // Convert features to an array of strings
      project_deadline: projectDeadline,
      required_skills: skillsRequired,
      number_of_students: numStudents,
      image_url: imageFile ? imageFile.name : "",
      user_id: user.user_id  // Explicitly
    };
    
    
    console.log("Form Data Submitted:", form_data);

    console.log("Features Array:", features);

    // Check if the user role is supervisor (role 3)
    if (user.role === "3") {
      const result = await Swal.fire({
        title: "Supervise Project?",
        text: "Do you want to supervise this project?",
        icon: "question",
        showCancelButton: true,    // Show the Cancel button
        showDenyButton: true,      // Show the Deny (No) button
        confirmButtonText: "Yes",  // Text for the Confirm button
        denyButtonText: "No",      // Text for the Deny button
        cancelButtonText: "Cancel", // Text for the Cancel button
      });

      // Handle user response
      if (result.isConfirmed) {
        form_data.supervise = true; // Add supervise field to form data
        console.log("User opted to supervise the project.");
      } else if (result.isDenied) {
        form_data.supervise = false; // Add supervise = false if user clicked "No"
        console.log("User declined to supervise the project.");
      } else if (result.isDismissed) {
        console.log("User canceled or closed the modal, stopping execution.");
        return; // Stop execution if the modal was closed or canceled
      }
    }

    // Proceed with the rest of the logic


    // Proceed with loading state after SweetAlert decision
    setLoading(true);

    try {
      console.log("Formatted Features Array:", form_data.features); // Expect ["React", "UserLogin"]
      // Make the API request only if user confirmed to supervise or declined but not canceled
      const response = await axios.post("/project", form_data);

      if (response) {
        const project = response.data;
        Swal.fire({ title: 'Success', text: 'Project Created Successfully', icon: 'success', confirmButtonText: 'Ok' });
        //setSuccessMessage("Project created successfully!");
        updateNotifyCount();
        console.log("Project created successfully:", project);
        emptyForm(); // Reset form after successful submission
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to create project',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        //setErrorMessage("Failed to create project");
      }
    } catch (error) {
      // setErrorMessage("Error submitting form: " + error.message);
      if (error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
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

                <div className="createproject_form">
                  <form onSubmit={handleSubmit}>
                    <label className="form_label">
                      What is the name of your project?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={projectName}
                      placeholder="Please enter the project name..."
                      onChange={(e) => setProjectName(e.target.value)}
                      maxLength={150}
                      required
                    />
                    <label className="form_label">
                      What is the main purpose of the product?
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="radio_button_container">
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
                    </div>
                    <label className="form_label">
                      What type of product do you want to build?
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
                    

                    <label className="form_label">
                      What is your estimated budget for this project (in
                      CAD)?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="project_budget"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      placeholder="Enter your budget"
                      min="0"
                      required
                    />

                    <label className="form_label">
                      Please provide a brief description of your product:
                      <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      type="text"
                      name="project_Description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Please enter the brief description for this project"
                      maxLength={250} // You can set a maximum length if needed
                      required
                    />

                    <label className="form_label">
                    Please select a category for this project?
                    <span className="text-danger"> *</span>
                    </label>
                    <Select
                      options={categoryOptions}
                      name="project_category"
                      className="margin-down"
                      onChange={(selected) => setCategory(selected.value)}
                      required
                    />

                    {/* Features */}
                    <label className="form_label">
                    What are the main features or functionalities you want to include in the project?
                    {/* <span className="text-danger"></span> */}
                    </label>
                    {/* <ReactTags
                      tags={features} // `features` should be an array of objects with { id, text }
                      handleDelete={handleDeleteFeature}
                      handleAddition={handleAddFeature}
                      placeholder="Add a feature and hit enter to add more..."
                    /> */}
                    <textarea
                      id="features"
                      name="features"
                      value={features} // This could be state-managed
                      onChange={(e) => setFeatures(e.target.value)} // Update your state
                      placeholder="Enter features separated by commas (e.g., User login, Sign up)"
                      rows="4"
                      cols="50"
                    />




                    <label className="form_label">
                      What is the expected timeline or deadline for the project completion?
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
                    Upload file(s) for reference...</label>
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
                    Please enter the number of student you want for this project? 
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
                    Please enter the required skills (technology) for this project?
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



                    <div className="message">
                      {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="success-message">{successMessage}</div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-12 text-center">
                        <button className="text-center button_text button-home" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Loading overlay */}
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
      </div>
      <div className="footer-fixed">
        <FooterComponent></FooterComponent>
      </div>
    </>
  );
};

export default CreateProjectComponent;