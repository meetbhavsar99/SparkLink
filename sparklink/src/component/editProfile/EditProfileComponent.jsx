import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfileComponent.css';
import MenuComponent from '../menu/MenuComponent';
import { useAuth } from '../../AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaEdit } from 'react-icons/fa';

import '../createproject/CreateProjectComponent.css';


const EditProfileComponent = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar ||
"https://bootdey.com/img/Content/avatar/avatar7.png");
const [showAvatarModal, setShowAvatarModal] = useState(false);

// Predefined avatar options
const avatars = [
"https://bootdey.com/img/Content/avatar/avatar1.png",
"https://bootdey.com/img/Content/avatar/avatar2.png",
"https://bootdey.com/img/Content/avatar/avatar3.png",
"https://bootdey.com/img/Content/avatar/avatar4.png",
"https://bootdey.com/img/Content/avatar/avatar5.png",
"https://bootdey.com/img/Content/avatar/avatar6.png",
"https://bootdey.com/img/Content/avatar/avatar7.png"
];

const handleAvatarSelection = (avatar) => {
setSelectedAvatar(avatar);
setProfile((prevProfile) => ({
...prevProfile,
avatar: avatar
}));
};

const handleOpenAvatarModal = () => {
    setShowAvatarModal(true);
};

const handleCloseAvatarModal = () => {
    setShowAvatarModal(false);
};


  // Fetch Profile Data
const fetchProfile = async () => {
    if (!user) return;
    try {
        const response = await axios.get('/editProfile');
        setRole(response.data.role);
        setProfile(response.data.profile);

        // Ensure avatar is set after fetching profile
        if (response.data.profile?.avatar) {
            setSelectedAvatar(response.data.profile.avatar);
        }
    } catch (err) {
        setError('Error fetching profile.');
    } finally {
        setLoading(false);
    }
};

// Use effect to fetch profile data
useEffect(() => {
    fetchProfile();
}, [user]);

// Ensure selectedAvatar updates when profile is fetched
useEffect(() => {
    if (profile) {
        setSelectedAvatar(profile.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png");
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
    avatar: selectedAvatar, // Save selected avatar
    };

    try {
      const response = await axios.post('/editProfile', updatedProfileData);
      fetchProfile(); 
      if (response.data.profile?.avatar) {
            setSelectedAvatar(response.data.profile.avatar); // ✅ Update UI with saved avatar
        }
      alert("Profile updated successfully!");
      navigate(`/profile?user_id=${user.user_id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile FE.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <MenuComponent />
      {/* Student profile */}
      {role === 'student' && (
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-6 col-sm-8 mx-auto">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="panel panel-default">
    <div className="panel-body text-center">
        <img
            src={selectedAvatar}
            className="img-circle profile-avatar"
            alt="User avatar"
        />
    </div>
                </div>

                {/* Avatar Selection UI */}
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">Select Your Avatar</h4>
                    </div>
                    <div className="panel-body avatar-grid">
                        {avatars.map((avatar, index) => (
                            <img 
                                key={index} 
                                src={avatar} 
                                alt={`Avatar ${index + 1}`} 
                                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`} 
                                onClick={() => handleAvatarSelection(avatar)}
                            />
                        ))}
                    </div>
                </div>


                {/* User Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">User Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Bio', name: 'bio', type: 'textarea' },
                      { label: 'Education', name: 'education', type: 'text' },
                      { label: 'Experience', name: 'experience', type: 'text' },
                      { label: 'Courses', name: 'course', type: 'text' },
                      { label: 'Skills', name: 'skills', type: 'text' },
                    ].map(({ label, name, type }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-8">
                          {type === 'textarea' ? (
                            <textarea
                              name={name}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          ) : (
                            <input
                              name={name}
                              type={type}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Contact Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Phone Number', name: 'phone_number', type: 'tel' },
                      { label: 'LinkedIn', name: 'linkedin', type: 'text' },
                      { label: 'GitHub', name: 'github', type: 'text' },
                      { label: 'Address', name: 'address', type: 'text' },
                    ].map(({ label, name, type, disabled }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-8">
                          <input
                            name={name}
                            type={type}
                            value={profile[name] || ''}
                            className="form-control"
                            onChange={handleChange}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            disabled={disabled || false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit and Cancel */}
                <div className="form-group">
                  <div className="col-sm-8 col-sm-offset-2">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <a href={`/Profile?user_id=${user.user_id}`} className="btn btn-secondary">Cancel</a>
                  </div>
                </div>

                {/* Message */}
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Profile */}
      {role === 'supervisor' && (
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-12 col-sm-9">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="panel panel-default">
    <div className="panel-body text-center position-relative">
        <img
            src={selectedAvatar}
            className="img-circle profile-avatar"
            alt="User avatar"
        />
        {/* Edit Button */}
        <button 
            className="avatar-edit-btn" 
            onClick={handleOpenAvatarModal}
        >
            <FaEdit size={20} />
        </button>
    </div>
</div>

{/* Avatar Selection Modal */}
<Modal show={showAvatarModal} onHide={handleCloseAvatarModal} centered>
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
                    className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`} 
                    onClick={() => handleAvatarSelection(avatar)}
                />
            ))}
        </div>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAvatarModal}>
            Cancel
        </Button>
        <Button variant="primary" onClick={handleCloseAvatarModal}>
            Save Avatar
        </Button>
    </Modal.Footer>
</Modal>


                {/* Supervisor Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Supervisor Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Department', name: 'department', type: 'text' },
                      { label: 'Domain', name: 'domain', type: 'text' },
                      { label: 'Bio', name: 'bio', type: 'textarea' },
                      { label: 'Expertise', name: 'expertise', type: 'text' },
                      { label: 'Education', name: 'education', type: 'text' },
                      { label: 'Experience', name: 'experience', type: 'text' },
                    ].map(({ label, name, type }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-10">
                          {type === 'textarea' ? (
                            <textarea
                              name={name}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          ) : (
                            <input
                              name={name}
                              type={type}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Contact Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Phone Number', name: 'phone_number', type: 'tel' },
                      { label: 'LinkedIn', name: 'linkedin', type: 'text' },
                      { label: 'GitHub', name: 'github', type: 'text' },
                      { label: 'Address', name: 'address', type: 'text' },
                    ].map(({ label, name, type, disabled }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-10">
                          <input
                            name={name}
                            type={type}
                            value={profile[name] || ''}
                            className="form-control"
                            onChange={handleChange}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            disabled={disabled || false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit and Cancel */}
                <div className="form-group">
                  <div className="col-sm-10 col-sm-offset-2">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <a href={`/Profile?user_id=${user.user_id}`} className="btn btn-secondary">Cancel</a>
                  </div>
                </div>

                {/* Message */}
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Business Owner Profile */}
      {role === 'business_owner' && (
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-12 col-sm-9">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="panel panel-default">
                  <div className="panel-body text-center">
                      <img
                          src={selectedAvatar}
                          className="img-circle profile-avatar"
                          alt="User avatar"
                      />
                  </div>
              </div>

              {/* Avatar Selection UI */}
              <div className="panel panel-default">
                  <div className="panel-heading">
                      <h4 className="panel-title">Select Your Avatar</h4>
                  </div>
                  <div className="panel-body avatar-grid">
                      {avatars.map((avatar, index) => (
                          <img 
                              key={index} 
                              src={avatar} 
                              alt={`Avatar ${index + 1}`} 
                              className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`} 
                              onClick={() => handleAvatarSelection(avatar)}
                          />
                      ))}
                  </div>
              </div>


                {/* Business Owner Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Business Owner Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Business Type', name: 'business_type', type: 'text' },
                      { label: 'Domain Type', name: 'domain_type', type: 'text' },
                      { label: 'Bio', name: 'bio', type: 'textarea' },
                    ].map(({ label, name, type }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-8">
                          {type === 'textarea' ? (
                            <textarea
                              name={name}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          ) : (
                            <input
                              name={name}
                              type={type}
                              value={profile[name] || ''}
                              className="form-control"
                              onChange={handleChange}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Contact Info</h4>
                  </div>
                  <div className="panel-body">
                    {[
                      { label: 'Phone Number', name: 'phone_number', type: 'tel' },
                      { label: 'LinkedIn', name: 'linkedin', type: 'text' },
                      { label: 'GitHub', name: 'github', type: 'text' },
                      { label: 'Address', name: 'address', type: 'text' },
                    ].map(({ label, name, type, disabled }) => (
                      <div className="form-group" key={name}>
                        <label className="col-sm-2 control-label">{label}</label>
                        <div className="col-sm-10">
                          <input
                            name={name}
                            type={type}
                            value={profile[name] || ''}
                            className="form-control"
                            onChange={handleChange}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            disabled={disabled || false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit and Cancel */}
                <div className="form-group">
                  <div className="col-sm-10 col-sm-offset-2">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <a href={`/Profile?user_id=${user.user_id}`} className="btn btn-secondary">Cancel</a>
                  </div>
                </div>

                {/* Message */}
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileComponent;