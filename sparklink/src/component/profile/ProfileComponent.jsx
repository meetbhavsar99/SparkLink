import MasterComponent from '../MasterComponent';
import '../progress-tracker/ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileComponent.css';
import { useAuth } from '../../AuthContext';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useSearchParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { TailSpin } from "react-loader-spinner";

import photo1 from '../../assets/project_images/photo1.jpg';
import photo2 from '../../assets/project_images/photo2.jpg';
import photo3 from '../../assets/project_images/photo3.jpg';
import photo4 from '../../assets/project_images/photo4.jpg';
import photo5 from '../../assets/project_images/photo5.jpg';
import photo6 from '../../assets/project_images/photo6.jpg';
import photo7 from '../../assets/project_images/photo7.jpg';
import photo8 from '../../assets/project_images/photo8.jpg';
import photo9 from '../../assets/project_images/photo9.jpg';
import photo10 from '../../assets/project_images/photo10.jpg';
import remove_icon from '../../assets/remove_icon.png';
import report_icon from '../../assets/report_icon.png';

// Array of images
const imageArray = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

//const User = require('../models/user');

const ProfileComponent = () => {
    const { user, isAuthenticated } = useAuth();
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [profileExists, setProfileExists] = useState(true);
    // const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
    const [projDescList, setProjDescList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [isScrollable, setIsScrollable] = useState(false);
    const [searchParams] = useSearchParams();
    const user_id_param = searchParams.get('user_id');
    const [projectList, setProjectList] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null); 

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
};

    const fetchProfile = async (user_id) => {
        console.log("Fetching profile for user_id:", user_id);
    
        if (!user_id) {
            setError("User ID is missing");
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.get("http://localhost:3100/profile", {
                params: { user_id }
            });
    
            console.log("Profile Response:", response.data);
    
            setRole(response.data.role || "student");  // Default to 'student' if missing
            setProfile(response.data.profile || null);
            setUserDetails(response.data.user_details || null);
            setProfileExists(response.data.profileExists !== undefined ? response.data.profileExists : true);
            setProjectList(response.data.projects || []);

            // Update avatar in state
            setSelectedAvatar(response.data.profile?.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png");
            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error);
    
            if (error.response?.status === 404) {
                console.warn("Profile not found. Allowing profile creation.");
                setProfileExists(false);  // Enable profile creation form
            } else {
                setError("Error fetching profile. Please try again.");
            }
    
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        console.log("TEST PROJ FETCH>>>>>", projectDetails);
    }, [projectDetails])

    const openModal = (project) => {
        console.log('==project==', project);
        setSelectedProject(project);
        const project_Desc = projectList.find(p => p.proj_id === project.proj_id);
        setSelectedProjectDetails(project_Desc);
        console.log("selected project desc 1= >", selectedProjectDetails);
        console.log("selected project desc 2= >", selectedProjectDetails.proj_desc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProject(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log("projects count : ", projectDetails.length);
        setIsScrollable(projectDetails.length > 3);
    }, [projectDetails]);

    useEffect(() => {
        console.log("selectedProjectDetails =1", selectedProjectDetails);
        // if (selectedProject && selectedProjectDetails) {
        //     console.log('split wala =>', selectedProjectDetails.proj_desc);
        //     let splitDesc = selectedProjectDetails.proj_desc.split(";");
        //     console.log("splitDesc=>", splitDesc);
        //     let filterDesc = [];
        //     for (let i = 0; i < splitDesc.length; i++) {
        //         filterDesc[i] = splitDesc[i].trim().split(":");
        //     }
        //     setProjDescList(filterDesc);
        // }
    }, [selectedProjectDetails]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchProfile(user_id_param || user.user_id);
        }
    }, [user, user_id_param]);

    useEffect(() => {
        if (profile?.avatar) {
        setSelectedAvatar(profile.avatar);
        }
        }, [profile]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // **Handle Form Submission**
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("User Object:", user);
        console.log("User Role Details:", user?.roleDetails);
        console.log("User Role Desc:", user?.roleDetails?.role_desc);
        console.log("User Role Desc:", user.role.roleDesc);
        //console.log("User Role Desc:", roleDesc);
    
        if (!user) {
            alert("User not found, please login again.");
            return;
        }

        const roleMap = {
            1: "admin",
            2: "supervisor",
            3: "business_owner",
            4: "student"
        };
        
    
        const formData = new FormData(e.target);
    
        const profileData = {
            user_id: user.user_id,
            role: roleMap[user.role] || "unknown",
            bio: formData.get("bio"),
            skills: formData.get("skills"),
            linkedin: formData.get("linkedin"),
            github: formData.get("github"),
            address: formData.get("address"),
            phone_number: formData.get("phone_number"),
            avatar: selectedAvatar || profile?.avatar 
        };

    
        try {
            await axios.post("http://localhost:3100/profile/create-profile", profileData);
            console.log("Profile Data Sent:", profileData);
            console.log("Sending Profile Data:", JSON.stringify(profileData, null, 2));

            alert("Profile updated successfully!");
            window.location.reload();
        } catch (error) {
            console.log("Sending Profile Data:", JSON.stringify(profileData, null, 2));

            console.error("Error creating profile:", error.response?.data || error);
            alert("Failed to create profile");
        }
    };
    

    // **If profile does not exist, show form to create profile**
//     if (profileExists === false) {  // Explicit check
//     return (
//         <div className="container pt-4">
//             <h1>Create Your Profile</h1>
//             <p>We couldn't find your profile. Please fill in the details to continue.</p>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="bio" placeholder="Bio" required />
//                 <input type="text" name="skills" placeholder="Skills" required />
//                 <input type="text" name="linkedin" placeholder="LinkedIn Profile" required />
//                 <input type="text" name="github" placeholder="GitHub Profile" required />
//                 <input type="text" name="address" placeholder="Address" required />
//                 <input type="text" name="phone_number" placeholder="Phone Number" required />
//                 <button type="submit">Create Profile</button>
//             </form>
//         </div>
//     );
// }

    return (
        <>
        {/* < className=""> */}
        <MenuComponent />
            <MasterComponent />
                        {role === 'admin' && (
                            <div className="admin-profile">
                                <div className="admin-header">
                                    <h1>Welcome, {userDetails.username}</h1>
                                    <p className="admin-subtitle">You are logged in as an <strong>Administrator</strong>.</p>
                                    </div>

                        {/* Contact Information */}
                                <div className="admin-contact">
                                    <h5>Contact Information</h5>
                                    <div className="admin-contact-details">
                                        <i className="fas fa-envelope contact-icon"></i>
                                        <p>{userDetails.email}</p>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div className="admin-actions-section">
                                    <h5>Admin Actions</h5>
                                    <div className="admin-actions">
                                        {/* <a href="/admin/dashboard" className="">
                                            <i className="fas fa-tachometer-alt"></i> Dashboard
                                        </a> */}
                                        <a href="/admin/viewusers" >
                                            <i className="fas fa-users"></i> View Users
                                        </a>
                                        {/* <a href="/admin/settings" >
                                            <i className="fas fa-cogs"></i> System Settings
                                        </a>
                                        <a href="/admin/analytics-reports" >
                                            <i className="fas fa-chart-bar"></i> Analytics & Reports
                                        </a> */}
                                        <a href="/admin/logs" >
                                            <i className="fas fa-file-alt"></i> View Logs
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
{role === 'student' && (
                                <div className="student-profile-container">
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
                                        <p className="student-skills">Skills: {profile.skills}</p>
                                        <div className="student-social-icons">
                                            <ul className="no-margin">
                                                {profile.linkedin && profile.linkedin.includes("linkedin.com") && (
                                                    <li>
                                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <i className="fab fa-linkedin-in"></i>
                                                        </a>
                                                    </li>
                                                )}
                                                {profile.github && profile.github.includes("github.com") && (
                                                    <li>
                                                        <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                                            <i className="fab fa-github"></i>
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                        {user_id_param ? (
                                            user.user_id === Number(user_id_param) && (
                                                <a href="/editProfile" className="button-home">Manage Profile</a>
                                            )
                                        ) : null}
                                    </div>
                                </div>

                                {/* Right Section: Bio and Contact Info */}
                                <div className="student-right">
                                    <div className="student-details">
                                        <h1 className="student-welcome">Welcome, {userDetails.username}</h1>
                                        <p className="student-bio">{profile.bio}</p>
                                        <div className="student-contact-info">
                                            <ul className="contact-list">
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-graduation-cap text-orange"></i> Degree:
                                                        </div>
                                                        <div className="contact-value">{profile.education}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-gem text-yellow"></i> Experience:
                                                        </div>
                                                        <div className="contact-value">{profile.experience}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-file text-lightred"></i> Courses:
                                                        </div>
                                                        <div className="contact-value">{profile.course}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-map-marker-alt text-green"></i> Address:
                                                        </div>
                                                        <div className="contact-value">{profile.address}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-mobile-alt text-purple"></i> Phone:
                                                        </div>
                                                        <div className="contact-value">{profile.phone_number}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="contact-row">
                                                        <div className="contact-label">
                                                            <i className="fas fa-envelope text-pink"></i> Email:
                                                        </div>
                                                        <div className="contact-value">{userDetails.email}</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Projects Section in Separate Row */}
                            <div className="student-projects-container">
                                <h2 className="student-projects-title">Projects you are working on currently:</h2>
                                <div className="student-projects">
                                    {projectList.map((project, index) => (
                                        <div
                                            className="student-project-card"
                                            key={index}
                                            onClick={() => openModal(project)}
                                        >
                                            <div className="project-image"
                                                style={{
                                                    backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                                loading="lazy">
                                            </div>
                                            <div className="project-info">
                                                <div className="project-title">{project.project_name}</div>
                                                <div className="project-progress-container">
                                                    <div className="project-progress-bar">
                                                        <div
                                                            className="project-progress"
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="project-progress-text">{project.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                             </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                <td className='proj-details-data'>
                                                    {new Date(selectedProjectDetails.end_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
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
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* student proile ends */}

            {/* supervisor profile starts */}
             {/* Supervisor Profile */}
{role === 'supervisor' && (
    <div className="supervisor-profile-container">
        <div className="supervisor-profile-card">

            {/* First Row: Avatar, Role, Social Media & Bio, Contact Info */}
            <div className="supervisor-profile-header">

                {/* Left Section - Avatar & Role */}
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

                    {/* Role & Manage Profile */}
                    <div className="supervisor-role-card">
                        <h4 className="supervisor-role">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </h4>

                        {/* Social Media Links */}
                        <div className="supervisor-social-icons">
                            <ul>
                                {profile.linkedin && profile.linkedin.includes("linkedin.com") && (
                                    <li>
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                    </li>
                                )}
                                {profile.github && profile.github.includes("github.com") && (
                                    <li>
                                        <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-github"></i>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Manage Profile Button */}
                        {user_id_param ? (
                            user.user_id === Number(user_id_param) && (
                                <a href="/editProfile" className="button-home">Manage Profile</a>
                            )
                        ) : null}
                    </div>
                </div>

                {/* Right Section - Bio & Contact Info */}
                <div className="supervisor-right">
                    <div className="supervisor-info">
                        <h1 className="supervisor-welcome">Welcome, {userDetails.username}</h1>
                        <p className="supervisor-bio">{profile.bio}</p>

                        {/* Contact Info */}
                        <div className="supervisor-contact-info">
                            <ul className="contact-list">
                                {[
                                    { label: "Education", name: "education", icon: "fas fa-graduation-cap" },
                                    { label: "Experience", name: "experience", icon: "fas fa-gem" },
                                    { label: "Courses", name: "course", icon: "fas fa-file" },
                                    { label: "Address", name: "address", icon: "fas fa-map-marker-alt" },
                                    { label: "Phone", name: "phone_number", icon: "fas fa-mobile-alt" },
                                    { label: "Email", name: "email", icon: "fas fa-envelope" },
                                ].map(({ label, name, icon }) => (
                                    <li key={name}>
                                        <div className="contact-row">
                                            <div className="contact-label">
                                                <i className={`${icon}`}></i> {label}:
                                            </div>
                                            <div className="contact-value">
                                                {profile[name] || (
                                                    <p style={{ color: "lightgray" }}>
                                                        Add your {label} by clicking Manage Profile
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div> {/* End of First Row */}

            {/* Second Row: Projects Section */}
            <div className="supervisor-projects-container">
                <h2 className="supervisor-projects-title">Projects you are supervising currently:</h2>
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
                                    backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                }}
                            ></div>
                            <div className="project-info">
                                <div className="project-title">{project.project_name}</div>
                                <div className="project-progress-container">
                                    <div className="project-progress-bar">
                                        <div
                                            className="project-progress"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="project-progress-text">{project.progress}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                <td className='proj-details-data'>
                                                    {new Date(selectedProjectDetails.end_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
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
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* supervisor profile ends */}
            {role === 'business_owner' && (
                <div className="business-owner-profile-container">
                    <div className="business-owner-profile-card">
                        {/* 🔹 First Row: Avatar, Role & Contact Info */}
                        <div className="business-owner-header">
                            {/* Left Section: Avatar & Role */}
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

                                    {/* Social Media Links */}
                                    <div className="business-owner-social-icons">
                                        <ul>
                                            {profile.linkedin && profile.linkedin.includes("linkedin.com") && (
                                                <li>
                                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </a>
                                                </li>
                                            )}
                                            {profile.github && profile.github.includes("github.com") && (
                                                <li>
                                                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                                        <i className="fab fa-github"></i>
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Manage Profile Button */}
                                    {user_id_param ? (
                                        user.user_id === Number(user_id_param) && (
                                            <a href="/editProfile" className="button-main">Manage Profile</a>
                                        )
                                    ) : null}
                                </div>
                            </div>

                            {/* Right Section: Bio & Contact Info */}
                            <div className="business-owner-right">
                                <div className="business-owner-info">
                                    <h1 className="business-owner-welcome">Welcome, {userDetails.username}</h1>
                                    <p className="business-owner-bio">{profile.bio}</p>

                                    {/* Contact Info */}
                                    <div className="business-owner-contact-info">
                                        <ul className="contact-list">
                                            <li>
                                                <div className="contact-row">
                                                    <div className="contact-label">
                                                        <i className="fas fa-building text-orange"></i> Business Type:
                                                    </div>
                                                    <div className="contact-value">
                                                        {profile.business_type || (
                                                            <p style={{ color: "lightgray" }}>Add your Business Type by clicking Manage Profile</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="contact-row">
                                                    <div className="contact-label">
                                                        <i className="fas fa-gem text-yellow"></i> Domain:
                                                    </div>
                                                    <div className="contact-value">
                                                        {profile.domain_type || (
                                                            <p style={{ color: "lightgray" }}>Add your domain by clicking Manage Profile</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="contact-row">
                                                    <div className="contact-label">
                                                        <i className="fas fa-map-marker-alt text-green"></i> Address:
                                                    </div>
                                                    <div className="contact-value">
                                                        {profile.address || (
                                                            <p style={{ color: "lightgray" }}>Add your address by clicking Manage Profile</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="contact-row">
                                                    <div className="contact-label">
                                                        <i className="fas fa-mobile-alt text-purple"></i> Phone:
                                                    </div>
                                                    <div className="contact-value">
                                                        {profile.phone_number || (
                                                            <p style={{ color: "lightgray" }}>Add your phone number by clicking Manage Profile</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="contact-row">
                                                    <div className="contact-label">
                                                        <i className="fas fa-envelope text-pink"></i> Email:
                                                    </div>
                                                    <div className="contact-value">{userDetails.email}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🔹 Second Row: Projects Section */}
                        <div className="business-owner-projects-container">
                            <h2 className="business-owner-projects-title">Projects you have listed currently:</h2>
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
                                                backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                            }}
                                        ></div>
                                        <div className="project-info">
                                            <div className="project-title">{project.project_name}</div>
                                            <div className="project-progress-container">
                                                <div className="project-progress-bar">
                                                    <div
                                                        className="project-progress"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="project-progress-text">{project.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                <td className='proj-details-data'>
                                                    {new Date(selectedProjectDetails.end_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
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
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* buisness owner profile ends */}


            <FooterComponent />
            {/* <FooterComponent></FooterComponent> */}
        </>
        
    );
};

export default ProfileComponent;
