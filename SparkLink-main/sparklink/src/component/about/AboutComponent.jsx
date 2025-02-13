import MasterComponent from '../MasterComponent';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import React from 'react';

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

    // Your New Team Members
    const currentTeam = [
        {
            id: 1,
            name: 'Meet Bhavsar',
            role: 'Full Stack Developer',
            responsibilities: 'Developing both frontend and backend components.',
            image: Meet,
            LinkedIn: 'https://www.linkedin.com/in/meetkumar-bhavsar-0059ba1b5/',
        },
        {
            id: 2,
            name: 'Heet Patel',
            role: 'Frontend Developer',
            responsibilities: 'Responsible for UI/UX improvements.',
            image: Heet,
            LinkedIn: 'https://www.linkedin.com/in/heet2002/',
        },
        {
            id: 3,
            name: 'Chaitanya  Parikh',
            role: 'Backend Developer',
            responsibilities: 'Handles API development and database management.',
            image: Chaitanya,
            LinkedIn: 'https://www.linkedin.com/in/chaitanyap310/',
        },
        {
            id: 4,
            name: 'Vinit Vekariya',
            role: 'QA & Testing',
            responsibilities: 'Ensures software quality through rigorous testing.',
            image: Vinit,
            LinkedIn: 'https://www.linkedin.com/in/vinit-vekariaengineer/',
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
            <div className="container">
                <h1 className="text-center mt-4">About Us</h1>

                {/* Project Overview */}
                <section className="mt-4">
                    <h2>Project Overview</h2>
                    <p><strong>Project Title:</strong> UWindsor SparkLink – Empowering IT Solutions through Student Innovation</p>
                    <p>
                        UWindsor SparkLink is a platform designed to connect University of Windsor departments with Computer Science students
                        for IT project support. It provides hands-on experience to students while solving departmental IT challenges. 
                        Key features include project submission, skill-based matching, and paid opportunities for students.
                    </p>
                </section>

                {/* Current Team (Expandable) */}
                <section className="mt-4">
                    <h2 
                        className="expandable-title"
                        onClick={() => setShowCurrentTeam(!showCurrentTeam)}
                    >
                        Current Team {showCurrentTeam ? '▼' : '▶'}
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
                                    <p><strong>Role:</strong> {member.role}</p>
                                    <p>{member.responsibilities}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Previous Team (Expandable) */}
                <section className="mt-4">
                    <h2 
                        className="expandable-title"
                        onClick={() => setShowPreviousTeam(!showPreviousTeam)}
                    >
                        Previous Team {showPreviousTeam ? '▼' : '▶'}
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
            <FooterComponent />
        </>
    );
};

export default AboutComponent;
