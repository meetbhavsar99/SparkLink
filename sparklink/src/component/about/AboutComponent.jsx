import MasterComponent from '../MasterComponent';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import React from 'react';
import linkedin_icon from "../../assets/linkedin_icon.png";
import github_icon from "../../assets/github_icon.png";
import mail_icon from "../../assets/mail_icon.png";


import './AboutComponent.css';
import Avatar from './images/Avatar.jpg';
import axios from 'axios';
import  { useState, useEffect } from 'react';

import './AboutComponent.css'

// Team Images
import Pooja from './images/Pooja.jpg';
import Gireesh from './images/Gireesh.jpg';
import Aman from './images/Aman.jpg';
import Joshua from './images/Joshua.jpeg';
import Micheal from './images/Micheal.jpeg';
import Kausar from './images/Kausar.jpg';

// Your New Team Members (Replace with real images if needed)
import Meet from './images/Meet.jpg';
import Heet from './images/Heet.jpg';
import Chaitanya from './images/Chaitanya.jpg';
import Vinit from './images/Vinit.jpg';

const AboutComponent = () => {
    const [showCurrentTeam, setShowCurrentTeam] = useState(true);
    const [showPreviousTeam, setShowPreviousTeam] = useState(false);
    const [showProfessor, setShowProfessor] = useState(false);


    // Your New Team Members
    const currentTeam = [
        {
            id: 1,
            name: 'Meet Bhavsar',
            role: 'Team Leader & Full Stack Developer',
            responsibilities: 'Led the development team, built the backend for the entire application, developed a fully functional frontend, and improved the UI for a better user experience.',
            image: Meet,
            LinkedIn: 'https://www.linkedin.com/in/meetkumar-bhavsar-0059ba1b5/',
            Github: 'https://github.com/meetbhavsar99',
            Email: 'meetbhavsar99@gmail.com'
        },
        {
            id: 3,
            name: 'Chaitanya  Panchal',
            role: 'Frontend Developer & VM Deployment',
            responsibilities: 'Worked on Virtual Machine setup and deployment, contributed to frontend development, and implemented UI enhancements to improve the application’s design and usability.',
            image: Chaitanya,
            LinkedIn: 'https://www.linkedin.com/in/chaitanyap310/',
            Github: 'https://github.com/Chaitanya-0310',
            Email: 'chaitanyapp03@gmail.com'
        },
        {
            id: 4,
            name: 'Vinit Vekaria',
            role: 'Frontend Developer & VM Deployment',
            responsibilities: 'Worked on Virtual Machine setup and deployment, contributed to frontend development, and implemented UI enhancements to improve the application’s design and usability.',
            image: Vinit,
            LinkedIn: 'https://www.linkedin.com/in/vinit-vekariaengineer/',
            Github: 'https://github.com/VekariaVinit',
            Email: 'vinitvekaria810@gmail.com'
        },
        {
            id: 2,
            name: 'Heet Patel',
            role: 'Frontend Developer',
            responsibilities: 'Assisted with UI refinements, ensured consistency in the design, and prepared comprehensive project documentation, including reports and presentations.',
            image: Heet,
            LinkedIn: 'https://www.linkedin.com/in/heet2002/',
            Github: 'https://github.com/heet2002',
            Email: 'patel2s9@uwindsor.ca'
        },
    ];

    // Previous Team Members
    const previousTeam = [
        {
            id: 1,
            name: 'Kausar Fatema',
            role: 'Backend & Assisting Front End',
            responsibilities: 'Backend development and API integration.',
            image: Kausar,
            LinkedIn: 'https://www.linkedin.com/in/kausar-fatema-9060871b1/',
        },
        {
            id: 2,
            name: 'Pooja Vishwakarma',
            role: 'Backend & JIRA Management',
            responsibilities: 'Handled backend development and managed JIRA pages.',
            image: Pooja,
            LinkedIn: 'https://www.linkedin.com/in/pooja-vishwakarma95/',
        },
        {
            id: 3,
            name: 'Fajuko Michael',
            role: 'Software and QA Automation Tester',
            responsibilities: 'Assisted front-end team, created About Us page, and writing test cases.',
            image: Micheal,
            LinkedIn: 'https://www.linkedin.com/in/fajuko-odunayo-5256a1265/',
        },
        {
            id: 4,
            name: 'Joshua Daniel',
            role: 'Front End Developer',
            responsibilities: 'Created the Project screen and worked on front-end components.',
            image: Joshua,
            LinkedIn: 'https://www.linkedin.com/in/joshua-daniel1999/',
        },
        {
            id: 5,
            name: 'Gireesh Chandra',
            role: 'Front End Developer',
            responsibilities: 'Developed the Landing and Progress Tracking screens.',
            image: Gireesh,
            LinkedIn: 'https://www.linkedin.com/in/gireesh-busam/',
        },
        {
            id: 6,
            name: 'Amanbhai Arifbhai',
            role: 'Mobile UI & Recommendation System',
            responsibilities: 'Designed the mobile UI and implemented the recommendation system.',
            image: Aman,
            LinkedIn: '',
        },
    ];

    // Fetch Recommended Projects
    useEffect(() => {
        const fetchRecommendedProjects = async () => {
            try {
                console.log("Fetching recommended projects...");
                const response = await axios.get('/api/users/recommendedprojects');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching recommended projects:', error);
            }
        };
        fetchRecommendedProjects();
    }, []);

    return (
        <>
            <MenuComponent />
            <MasterComponent />
            <div className="container">
            <div className="content-wrapper">
                <h1 className="mt-4 text-heading">About Us</h1>

                {/* Project Overview */}
                <section className="project-overview">
                <h2>Project Overview</h2>
                <p className="project-title">
                    <strong>Project Title:</strong> UWindsor SparkLink – Empowering IT Solutions through Student Innovation
                </p>
                <p className="project-description">
                    UWindsor SparkLink is a platform designed to connect University of Windsor departments with Computer Science students for IT project support.
                    It provides hands-on experience to students while solving departmental IT challenges.
                    Key features include project submission, skill-based matching, and paid opportunities for students.
                </p>
                </section>

                {/* Professor (Expandable) */}
                <section className="mt-4">
                    <h2 
                        className="expandable-title"
                        onClick={() => setShowProfessor(!showProfessor)} // Correct state toggle
                    >
                        Professor {showProfessor ? '▼' : '▶'}
                    </h2>
                    {showProfessor && (
                        <div className="team-grid">
                            <div className="team-card">
                                <img src="" alt="Professor Olena Syrotkina" className="" />
                                <h3>
                                    <a href="https://www.linkedin.com/in/olena-syrotkina/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="member-link">
                                        Olena Syrotkina
                                    </a>
                                </h3>
                                <p><strong>Supervised the entire project</strong></p>
                            </div>
                        </div>
                    )}
                </section>



                {/* Current Team (Expandable) */}
                <section className="mt-4">
                    <h2 
                        className="expandable-title"
                        onClick={() => setShowCurrentTeam(!showCurrentTeam)}
                    >
                        Current Team (Winter 2025) {showCurrentTeam ? '▼' : '▶'}
                    </h2>
                    {showCurrentTeam && (
                        <div className="team-grid">
                            {currentTeam.map((member) => (
                                <div className="team-card" key={member.id}>
                                    <img src={member.image} alt={member.name} className="team-image" />
                                    <h3>
                                        <a href={member.LinkedIn} target="_blank" rel="noopener noreferrer" className="member-link">
                                            {member.name}
                                        </a>
                                    </h3>

                                    {/* Social Links */}
                                    <div className="social-icons">
                                        {/* LinkedIn Icon */}
                                        <a href={member.LinkedIn ? member.LinkedIn : "#"} 
                                        target={member.LinkedIn ? "_blank" : "_self"} 
                                        rel="noopener noreferrer"
                                        className={`icon-linkedin ${!member.LinkedIn ? "disabled-link" : ""}`}
                                        title={member.LinkedIn ? "View LinkedIn Profile" : "No link available"}>
                                            <img src={linkedin_icon} alt="LinkedIn" className="social-icon" />
                                        </a>

                                        {/* GitHub Icon */}
                                        <a href={member.Github ? member.Github : "#"} 
                                        target={member.Github ? "_blank" : "_self"} 
                                        rel="noopener noreferrer"
                                        className={`icon-github ${!member.Github ? "disabled-link" : ""}`}
                                        title={member.Github ? "View GitHub Profile" : "No link available"}>
                                            <img src={github_icon} alt="LinkedIn" className="social-icon" />
                                        </a>

                                        {/* Email Icon */}
                                        <a href={member.Email ? `mailto:${member.Email}` : "#"} 
                                        className={`icon-email ${!member.Email ? "disabled-link" : ""}`}
                                        title={member.Email ? "Send an Email" : "No email available"}>
                                            <img src={mail_icon} alt="LinkedIn" className="social-icon" />
                                        </a>

                                    </div>

                                    <p><strong>Role:</strong> {member.role}</p>
                                    <p>{member.responsibilities}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Previous Team (Expandable) */}
                <section className="mt-4 mb-4">
                    <h2 
                        className="expandable-title"
                        onClick={() => setShowPreviousTeam(!showPreviousTeam)}
                    >
                        Previous Team (Fall 2024) {showPreviousTeam ? '▼' : '▶'}
                    </h2>
                    {showPreviousTeam && (
                        <div className="team-grid">
                            {previousTeam.map((member) => (
                                <div className="team-card" key={member.id}>
                                    <img src={member.image} alt={member.name} className="team-image" />
                                    <h3>
                                        <a href={member.LinkedIn} target="_blank" rel="noopener noreferrer" className="member-link">
                                            {member.name}
                                        </a>
                                    </h3>
                                    <p><strong>Role:</strong> {member.role}</p>
                                    <p>{member.responsibilities}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default AboutComponent;
