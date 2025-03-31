import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfileComponent.css";
import MenuComponent from "../menu/MenuComponent";
import { useAuth } from "../../AuthContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../createproject/CreateProjectComponent.css";

const EditProfileComponent = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    profile?.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png"
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const navigate = useNavigate();

  // Predefined avatar options
  const avatars = [
    "https://bootdey.com/img/Content/avatar/avatar1.png",
    "https://bootdey.com/img/Content/avatar/avatar2.png",
    "https://bootdey.com/img/Content/avatar/avatar3.png",
    "https://bootdey.com/img/Content/avatar/avatar4.png",
    "https://bootdey.com/img/Content/avatar/avatar5.png",
    "https://bootdey.com/img/Content/avatar/avatar6.png",
    "https://bootdey.com/img/Content/avatar/avatar7.png",
  ];

  const handleAvatarSelection = (avatar) => {
    setSelectedAvatar(avatar);
    setProfile((prevProfile) => ({
      ...prevProfile,
      avatar: avatar,
    }));
  };

  const handleAvatarModal = (state) => {
    setShowAvatarModal(state);
  };

  const saveAvatarSelection = () => {
    setProfile({ ...profile, avatar: selectedAvatar });
    handleAvatarModal(false);
  };

  const handleOpenAvatarModal = () => setShowAvatarModal(true);
  const handleCloseAvatarModal = () => setShowAvatarModal(false);

  // Fetch Profile Data
  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await axios.get("/editProfile");
      setRole(response.data.role);
      setProfile(response.data.profile);

      // If avatar exists, update selectedAvatar
      if (response.data.profile?.avatar) {
        setSelectedAvatar(response.data.profile.avatar);
      }
    } catch (err) {
      setError("Error fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setSelectedAvatar(
        profile.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png"
      );
    }
  }, [profile]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProfileData = {
      ...profile,
      avatar: selectedAvatar,
    };

    try {
      const response = await axios.post("/editProfile", updatedProfileData);
      fetchProfile();

      // Show success toast
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        icon: "✅",
      });

      setTimeout(() => {
        navigate(`/profile?user_id=${user.user_id}`);
      }, 2000);
    } catch (error) {
      // Show error toast
      toast.error(
        "⚠️ " + (error.response?.data?.message || "Failed to update profile."),
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          icon: "❌",
        }
      );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <ToastContainer />

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-icon">
              <div className="spinner-border" role="status"></div>
            </div>
            <div className="loading-text">
              ⏳ Please wait, we’re processing your request...
            </div>
          </div>
        </div>
      )}

      <MenuComponent />

      {/* STUDENT EDIT PAGE */}
      {role === "student" && (
        <div className="profile-container">
          <div className="profile-card">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              {/* Avatar Panel */}
              <div className="panel">
                <div className="panel-body text-center position-relative">
                  <img
                    src={selectedAvatar}
                    className="profile-avatar"
                    alt="User avatar"
                  />
                  {/* If you want an edit icon over the avatar, uncomment below:
                  <button
                    className="avatar-edit-btn"
                    type="button"
                    onClick={handleOpenAvatarModal}
                  >
                    <FaEdit size={20} />
                  </button> */}
                </div>
              </div>

              {/* Avatar Selection Modal */}
              <Modal
                show={showAvatarModal}
                onHide={handleCloseAvatarModal}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select Your Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="avatar-grid">
                    {avatars.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className={`avatar-option ${
                          selectedAvatar === avatar ? "selected" : ""
                        }`}
                        onClick={() => handleAvatarSelection(avatar)}
                      />
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAvatarModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveAvatarSelection}>
                    Save Avatar
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* User Info Panel */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">User Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    { label: "Bio", name: "bio", type: "textarea" },
                    { label: "Education", name: "education", type: "text" },
                    { label: "Experience", name: "experience", type: "text" },
                    { label: "Courses", name: "course", type: "text" },
                    { label: "Skills", name: "skills", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      {type === "textarea" ? (
                        <textarea
                          name={name}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          name={name}
                          type={type}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info Panel */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">Contact Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    {
                      label: "Phone Number",
                      name: "phone_number",
                      type: "tel",
                    },
                    { label: "LinkedIn", name: "linkedin", type: "text" },
                    { label: "GitHub", name: "github", type: "text" },
                    { label: "Address", name: "address", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      <input
                        name={name}
                        type={type}
                        value={profile[name] || ""}
                        className="form-control"
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit + Cancel */}
              <div className="button-container">
                <button type="submit" className="button-primary">
                  Submit
                </button>
                <a
                  href={`/Profile?user_id=${user.user_id}`}
                  className="button-secondary"
                >
                  Cancel
                </a>
              </div>

              {/* Success/Error Messages */}
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
            </form>
          </div>
        </div>
      )}

      {/* SUPERVISOR EDIT PAGE */}
      {role === "supervisor" && (
        <div className="profile-container">
          <div className="profile-card">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              {/* Avatar Panel */}
              <div className="panel">
                <div className="panel-body text-center position-relative">
                  <img
                    src={selectedAvatar}
                    className="profile-avatar"
                    alt="User avatar"
                  />
                </div>
              </div>

              {/* Avatar Selection Modal */}
              <Modal
                show={showAvatarModal}
                onHide={handleCloseAvatarModal}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select Your Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="avatar-grid">
                    {avatars.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className={`avatar-option ${
                          selectedAvatar === avatar ? "selected" : ""
                        }`}
                        onClick={() => handleAvatarSelection(avatar)}
                      />
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAvatarModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveAvatarSelection}>
                    Save Avatar
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Supervisor Info */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">Supervisor Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    { label: "Department", name: "department", type: "text" },
                    { label: "Domain", name: "domain", type: "text" },
                    { label: "Bio", name: "bio", type: "textarea" },
                    { label: "Expertise", name: "expertise", type: "text" },
                    { label: "Education", name: "education", type: "text" },
                    { label: "Experience", name: "experience", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      {type === "textarea" ? (
                        <textarea
                          name={name}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          name={name}
                          type={type}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">Contact Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    {
                      label: "Phone Number",
                      name: "phone_number",
                      type: "tel",
                    },
                    { label: "LinkedIn", name: "linkedin", type: "text" },
                    { label: "GitHub", name: "github", type: "text" },
                    { label: "Address", name: "address", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      <input
                        name={name}
                        type={type}
                        value={profile[name] || ""}
                        className="form-control"
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit + Cancel */}
              <div className="button-container">
                <button type="submit" className="button-primary">
                  Submit
                </button>
                <a
                  href={`/Profile?user_id=${user.user_id}`}
                  className="button-secondary"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUSINESS OWNER EDIT PAGE */}
      {role === "business_owner" && (
        <div className="profile-container">
          <div className="profile-card">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              {/* Avatar Panel */}
              <div className="panel">
                <div className="panel-body text-center">
                  <img
                    src={selectedAvatar}
                    className="profile-avatar"
                    alt="User avatar"
                  />
                </div>
              </div>

              {/* Avatar Selection Modal (optional) */}
              <Modal
                show={showAvatarModal}
                onHide={handleCloseAvatarModal}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select Your Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="avatar-grid">
                    {avatars.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className={`avatar-option ${
                          selectedAvatar === avatar ? "selected" : ""
                        }`}
                        onClick={() => handleAvatarSelection(avatar)}
                      />
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAvatarModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveAvatarSelection}>
                    Save Avatar
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Business Owner Info */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">Business Owner Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    {
                      label: "Business Type",
                      name: "business_type",
                      type: "text",
                    },
                    { label: "Domain Type", name: "domain_type", type: "text" },
                    { label: "Bio", name: "bio", type: "textarea" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      {type === "textarea" ? (
                        <textarea
                          name={name}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          name={name}
                          type={type}
                          value={profile[name] || ""}
                          className="form-control"
                          onChange={handleChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="panel">
                <div className="panel-heading">
                  <h4 className="panel-title">Contact Info</h4>
                </div>
                <div className="panel-body">
                  {[
                    {
                      label: "Phone Number",
                      name: "phone_number",
                      type: "tel",
                    },
                    { label: "LinkedIn", name: "linkedin", type: "text" },
                    { label: "GitHub", name: "github", type: "text" },
                    { label: "Address", name: "address", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                      <label className="control-label">{label}</label>
                      <input
                        name={name}
                        type={type}
                        value={profile[name] || ""}
                        className="form-control"
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit + Cancel */}
              <div className="button-container">
                <button type="submit" className="button-primary">
                  Submit
                </button>
                <a
                  href={`/Profile?user_id=${user.user_id}`}
                  className="button-secondary"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileComponent;
