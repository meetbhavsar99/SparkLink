import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Avatar from "react-avatar";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";

import { useAuth } from "../../AuthContext";

import photo1 from "../../assets/project_images/photo1.jpg";
import photo2 from "../../assets/project_images/photo2.jpg";
import photo3 from "../../assets/project_images/photo3.jpg";
import photo4 from "../../assets/project_images/photo4.jpg";
import photo5 from "../../assets/project_images/photo5.jpg";
import photo6 from "../../assets/project_images/photo6.jpg";
import photo7 from "../../assets/project_images/photo7.jpg";
import photo8 from "../../assets/project_images/photo8.jpg";
import photo9 from "../../assets/project_images/photo9.jpg";
import photo10 from "../../assets/project_images/photo10.jpg";

import "./ProfileComponent.css";

// Array of images for project cards
const imageArray = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
];

const ProfileComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For the Projects
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const user_id_param = searchParams.get("user_id");

  // Fetch profile from backend
  const fetchProfile = async (user_id) => {
    if (!user_id) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/api/profile", {
        params: { user_id },
      });
      setRole(response.data.role || "student"); // fallback to 'student'
      setProfile(response.data.profile || null);
      setUserDetails(response.data.user_details || null);
      setProfileExists(
        response.data.profileExists !== undefined
          ? response.data.profileExists
          : true
      );
      setProjectList(response.data.projects || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err);
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError("Error fetching profile. Please try again.");
      }
      setLoading(false);
    }
  };

  // Open project modal
  const openModal = (project) => {
    setSelectedProject(project);
    setSelectedProjectDetails(
      projectList.find((p) => p.proj_id === project.proj_id)
    );
    setIsModalOpen(true);
  };

  // Close project modal
  const closeModal = () => {
    setSelectedProject(null);
    setSelectedProjectDetails(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile(user_id_param || user.user_id);
    }
  }, [user, user_id_param, isAuthenticated]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-page">
      {/* This .profile-content fills leftover space, pushing the footer down */}
      <div className="profile-content">
        <MenuComponent />
        <MasterComponent />

        {/* ADMIN VIEW */}
        {role === "admin" && userDetails && (
          <div className="admin-profile my-5">
            <div className="admin-header">
              <h1>Welcome, {userDetails.username}</h1>
              <p className="admin-subtitle">
                You are logged in as an <strong>Administrator</strong>.
              </p>
            </div>
            <div className="admin-contact">
              <h5>Contact Information</h5>
              <div className="admin-contact-details">
                <i className="fas fa-envelope contact-icon"></i>
                <p>{userDetails.email}</p>
              </div>
            </div>
            <div className="admin-actions-section">
              <h5>Admin Actions</h5>
              <div className="admin-actions">
                <a href="/admin/viewusers">
                  <i className="fas fa-users"></i> View Users
                </a>
                <a href="/admin/logs">
                  <i className="fas fa-file-alt"></i> View Logs
                </a>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT VIEW */}
        {role === "student" && userDetails && (
          <div className="student-profile-container mb-4">
            <div className="student-profile-card">
              <div className="row student-profile-header">
                {/* Left Section: Avatar, Role, and Social Media */}
                <div className="student-left">
                  <div className="student-avatar-container">
                    <Avatar
                      name={userDetails.username}
                      round={true}
                      size="120"
                      color="#005596"
                      fgColor="#fff"
                      textSizeRatio={2}
                    />
                  </div>
                  <div className="student-role-info">
                    <h4 className="student-role">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </h4>
                    <p className="student-skills">Skills: {profile?.skills}</p>
                    <div className="student-social-icons">
                      <ul className="no-margin">
                        {profile?.linkedin?.includes("linkedin.com") && (
                          <li>
                            <a
                              href={profile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                        )}
                        {profile?.github?.includes("github.com") && (
                          <li>
                            <a
                              href={profile.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-github"></i>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Manage Profile Button (only if it's your own profile) */}
                    {user_id_param ? (
                      user.user_id === Number(user_id_param) && (
                        <a href="/editProfile" className="button-home">
                          Manage Profile
                        </a>
                      )
                    ) : (
                      <a href="/editProfile" className="button-home">
                        Manage Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Section: Bio and Contact Info */}
                <div className="student-right">
                  <div className="student-details">
                    <h1 className="student-welcome">
                      Welcome, {userDetails.username}
                    </h1>
                    <p className="student-bio">{profile?.bio}</p>
                    <div className="student-contact-info">
                      <ul className="contact-list">
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-graduation-cap text-orange"></i>{" "}
                              Degree:
                            </div>
                            <div className="contact-value">
                              {profile?.education}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-gem text-yellow"></i>{" "}
                              Experience:
                            </div>
                            <div className="contact-value">
                              {profile?.experience}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-file text-lightred"></i>{" "}
                              Courses:
                            </div>
                            <div className="contact-value">
                              {profile?.course}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-map-marker-alt text-green"></i>{" "}
                              Address:
                            </div>
                            <div className="contact-value">
                              {profile?.address}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-mobile-alt text-purple"></i>{" "}
                              Phone:
                            </div>
                            <div className="contact-value">
                              {profile?.phone_number}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-envelope text-pink"></i>{" "}
                              Email:
                            </div>
                            <div className="contact-value">
                              {userDetails.email}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="student-projects-container">
                <h2 className="student-projects-title">
                  Projects you are working on currently:
                </h2>
                <div className="student-projects">
                  {projectList.map((project, index) => (
                    <div
                      className="student-project-card"
                      key={index}
                      onClick={() => openModal(project)}
                    >
                      <div
                        className="project-image"
                        style={{
                          backgroundImage: `url(${
                            imageArray[Number(project.image_url)] || ""
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div className="project-info">
                        <div className="project-title">
                          {project.project_name}
                        </div>
                        <div className="project-progress-container">
                          <div className="project-progress-bar">
                            <div
                              className="project-progress"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="project-progress-text">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal for Project Details */}
            <Modal
              size="xl"
              show={isModalOpen}
              onHide={closeModal}
              scrollable
              aria-labelledby="project_details_modal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="project_details_modal">
                  Project Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedProject && selectedProjectDetails && (
                  <Table responsive bordered hover>
                    <tbody>
                      <tr>
                        <td colSpan={2} className="proj-details-header">
                          Project Name: {selectedProjectDetails.project_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Purpose</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.purpose}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Product</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.product}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Description</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Features</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.features}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Budget</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.budget}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">
                          Skill(s) Required
                        </td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.skills_req}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">End Date</td>
                        <td className="proj-details-data">
                          {new Date(
                            selectedProjectDetails.end_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Status</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.status_desc}
                        </td>
                      </tr>
                      {["business_owner", "supervisor", "student"].map((r) => {
                        const stakeholdersByRole =
                          selectedProjectDetails?.stakeholder?.filter(
                            (s) => s.role === r
                          ) || [];
                        if (stakeholdersByRole.length > 0) {
                          return (
                            <tr key={r}>
                              <td className="proj-details-sub-header">
                                {r === "business_owner" && "Business Owner"}
                                {r === "supervisor" && "Supervisor(s)"}
                                {r === "student" && "Student(s)"}
                              </td>
                              <td className="proj-details-data">
                                {stakeholdersByRole.map(({ name, user_id }) => (
                                  <div
                                    key={`${r}-${user_id}`}
                                    className="stakeholder-button"
                                  >
                                    {name}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </Table>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="button-home" onClick={closeModal}>
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        {/* SUPERVISOR VIEW */}
        {role === "supervisor" && userDetails && (
          <div className="supervisor-profile-container mb-4">
            <div className="supervisor-profile-card">
              {/* First Row: Avatar & Contact Info */}
              <div className="supervisor-profile-header">
                {/* Left Section */}
                <div className="supervisor-left">
                  <div className="supervisor-avatar-container">
                    <Avatar
                      name={userDetails.username}
                      round={true}
                      size="140"
                      color="#005596"
                      fgColor="#fff"
                      textSizeRatio={2}
                    />
                  </div>
                  <div className="supervisor-role-card">
                    <h4 className="supervisor-role">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </h4>
                    {/* Social Media */}
                    <div className="supervisor-social-icons">
                      <ul>
                        {profile?.linkedin?.includes("linkedin.com") && (
                          <li>
                            <a
                              href={profile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                        )}
                        {profile?.github?.includes("github.com") && (
                          <li>
                            <a
                              href={profile.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-github"></i>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Manage Profile */}
                    {user_id_param ? (
                      user.user_id === Number(user_id_param) && (
                        <a href="/editProfile" className="button-home">
                          Manage Profile
                        </a>
                      )
                    ) : (
                      <a href="/editProfile" className="button-home">
                        Manage Profile
                      </a>
                    )}
                  </div>
                </div>
                {/* Right Section */}
                <div className="supervisor-right">
                  <div className="supervisor-info">
                    <h1 className="supervisor-welcome">
                      Welcome, {userDetails.username}
                    </h1>
                    <p className="supervisor-bio">{profile?.bio}</p>
                    <div className="supervisor-contact-info">
                      <ul className="contact-list">
                        {[
                          {
                            label: "Education",
                            name: "education",
                            icon: "fas fa-graduation-cap",
                          },
                          {
                            label: "Experience",
                            name: "experience",
                            icon: "fas fa-gem",
                          },
                          {
                            label: "Courses",
                            name: "course",
                            icon: "fas fa-file",
                          },
                          {
                            label: "Address",
                            name: "address",
                            icon: "fas fa-map-marker-alt",
                          },
                          {
                            label: "Phone",
                            name: "phone_number",
                            icon: "fas fa-mobile-alt",
                          },
                          {
                            label: "Email",
                            name: "email",
                            icon: "fas fa-envelope",
                          },
                        ].map(({ label, name, icon }) => (
                          <li key={name}>
                            <div className="contact-row">
                              <div className="contact-label">
                                <i className={`${icon}`}></i> {label}:
                              </div>
                              <div className="contact-value">
                                {/* If profile[name] is empty, show a placeholder */}
                                {profile?.[name] ||
                                  (name === "email"
                                    ? userDetails.email
                                    : "Add your " +
                                      label +
                                      " in Manage Profile")}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Second Row: Projects */}
              <div className="supervisor-projects-container">
                <h2 className="supervisor-projects-title">
                  Projects you are supervising currently:
                </h2>
                <div className="supervisor-projects">
                  {projectList.map((project, index) => (
                    <div
                      className="supervisor-project-card"
                      key={index}
                      onClick={() => openModal(project)}
                    >
                      <div
                        className="project-image"
                        style={{
                          backgroundImage: `url(${
                            imageArray[Number(project.image_url)] || ""
                          })`,
                        }}
                      ></div>
                      <div className="project-info">
                        <div className="project-title">
                          {project.project_name}
                        </div>
                        <div className="project-progress-container">
                          <div className="project-progress-bar">
                            <div
                              className="project-progress"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="project-progress-text">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal for Project Details */}
            <Modal
              size="xl"
              show={isModalOpen}
              onHide={closeModal}
              scrollable
              aria-labelledby="supervisor_project_modal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="supervisor_project_modal">
                  Project Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedProject && selectedProjectDetails && (
                  <Table responsive bordered hover>
                    <tbody>
                      <tr>
                        <td colSpan={2} className="proj-details-header">
                          Project Name: {selectedProjectDetails.project_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Purpose</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.purpose}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Product</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.product}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Description</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Features</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.features}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Budget</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.budget}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">
                          Skill(s) Required
                        </td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.skills_req}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">End Date</td>
                        <td className="proj-details-data">
                          {new Date(
                            selectedProjectDetails.end_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Status</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.status_desc}
                        </td>
                      </tr>
                      {["business_owner", "supervisor", "student"].map((r) => {
                        const stakeholdersByRole =
                          selectedProjectDetails?.stakeholder?.filter(
                            (s) => s.role === r
                          ) || [];
                        if (stakeholdersByRole.length > 0) {
                          return (
                            <tr key={r}>
                              <td className="proj-details-sub-header">
                                {r === "business_owner" && "Business Owner"}
                                {r === "supervisor" && "Supervisor(s)"}
                                {r === "student" && "Student(s)"}
                              </td>
                              <td className="proj-details-data">
                                {stakeholdersByRole.map(({ name, user_id }) => (
                                  <div
                                    key={`${r}-${user_id}`}
                                    className="stakeholder-button"
                                  >
                                    {name}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </Table>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="button-home" onClick={closeModal}>
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        {/* BUSINESS OWNER VIEW */}
        {role === "business_owner" && userDetails && (
          <div className="business-owner-profile-container mb-4">
            <div className="business-owner-profile-card">
              {/* First Row: Avatar, Role, Social Media, & Contact Info */}
              <div className="business-owner-header">
                <div className="business-owner-left">
                  <div className="business-owner-avatar-container">
                    <Avatar
                      name={userDetails.username}
                      round={true}
                      size="140"
                      color="#005596"
                      fgColor="#fff"
                      textSizeRatio={2}
                    />
                  </div>
                  <div className="business-owner-role-card">
                    <h4 className="business-owner-role">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </h4>
                    {/* Social Media */}
                    <div className="business-owner-social-icons">
                      <ul>
                        {profile?.linkedin?.includes("linkedin.com") && (
                          <li>
                            <a
                              href={profile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                        )}
                        {profile?.github?.includes("github.com") && (
                          <li>
                            <a
                              href={profile.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-github"></i>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Manage Profile */}
                    {user_id_param ? (
                      user.user_id === Number(user_id_param) && (
                        <a href="/editProfile" className="button-home">
                          Manage Profile
                        </a>
                      )
                    ) : (
                      <a href="/editProfile" className="button-home">
                        Manage Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="business-owner-right">
                  <div className="business-owner-info">
                    <h1 className="business-owner-welcome">
                      Welcome, {userDetails.username}
                    </h1>
                    <p className="business-owner-bio">{profile?.bio}</p>
                    <div className="business-owner-contact-info">
                      <ul className="contact-list">
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-building text-orange"></i>{" "}
                              Business Type:
                            </div>
                            <div className="contact-value">
                              {profile?.business_type ||
                                "Add your Business Type in Manage Profile"}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-gem text-yellow"></i> Domain:
                            </div>
                            <div className="contact-value">
                              {profile?.domain_type ||
                                "Add your Domain in Manage Profile"}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-map-marker-alt text-green"></i>{" "}
                              Address:
                            </div>
                            <div className="contact-value">
                              {profile?.address ||
                                "Add your Address in Manage Profile"}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-mobile-alt text-purple"></i>{" "}
                              Phone:
                            </div>
                            <div className="contact-value">
                              {profile?.phone_number ||
                                "Add your Phone in Manage Profile"}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="contact-row">
                            <div className="contact-label">
                              <i className="fas fa-envelope text-pink"></i>{" "}
                              Email:
                            </div>
                            <div className="contact-value">
                              {userDetails.email}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Second Row: Projects Section */}
              <div className="business-owner-projects-container">
                <h2 className="business-owner-projects-title">
                  Projects you have listed currently:
                </h2>
                <div className="business-owner-header">
                  {projectList.map((project, index) => (
                    <div
                      className="business-owner-project-card"
                      key={index}
                      onClick={() => openModal(project)}
                    >
                      <div
                        className="project-image"
                        style={{
                          backgroundImage: `url(${
                            imageArray[Number(project.image_url)] || ""
                          })`,
                        }}
                      ></div>
                      <div className="project-info">
                        <div className="project-title">
                          {project.project_name}
                        </div>
                        <div className="project-progress-container">
                          <div className="project-progress-bar">
                            <div
                              className="project-progress"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="project-progress-text">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal for Project Details */}
            <Modal
              size="xl"
              show={isModalOpen}
              onHide={closeModal}
              scrollable
              aria-labelledby="business_owner_project_modal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="business_owner_project_modal">
                  Project Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedProject && selectedProjectDetails && (
                  <Table responsive bordered hover>
                    <tbody>
                      <tr>
                        <td colSpan={2} className="proj-details-header">
                          Project Name: {selectedProjectDetails.project_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Purpose</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.purpose}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Product</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.product}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Description</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Features</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.features}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Budget</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.budget}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">
                          Skill(s) Required
                        </td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.skills_req}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">End Date</td>
                        <td className="proj-details-data">
                          {new Date(
                            selectedProjectDetails.end_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="proj-details-sub-header">Status</td>
                        <td className="proj-details-data">
                          {selectedProjectDetails.status_desc}
                        </td>
                      </tr>
                      {["business_owner", "supervisor", "student"].map((r) => {
                        const stakeholdersByRole =
                          selectedProjectDetails?.stakeholder?.filter(
                            (s) => s.role === r
                          ) || [];
                        if (stakeholdersByRole.length > 0) {
                          return (
                            <tr key={r}>
                              <td className="proj-details-sub-header">
                                {r === "business_owner" && "Business Owner"}
                                {r === "supervisor" && "Supervisor(s)"}
                                {r === "student" && "Student(s)"}
                              </td>
                              <td className="proj-details-data">
                                {stakeholdersByRole.map(({ name, user_id }) => (
                                  <div
                                    key={`${r}-${user_id}`}
                                    className="stakeholder-button"
                                  >
                                    {name}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </Table>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="button-home" onClick={closeModal}>
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
      </div>

      {/* Footer is placed after the main content, so it sits at the bottom */}
      <FooterComponent />
    </div>
  );
};

export default ProfileComponent;
