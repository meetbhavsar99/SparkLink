import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import "./ProfileComponent.css";
import Swal from "sweetalert2";

const ProfileComponent = () => {
    const { user_id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/profile`, { params: { user_id } });
                setUserData(response.data.user);
            } catch (err) {
                Swal.fire({ title: "Error", text: err.message, icon: "error", confirmButtonText: "Ok" });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user_id]);

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (!userData) {
        return <div className="error">User not found</div>;
    }

    return (
        <>
            <div className="page-container">
                <MenuComponent />
                <MasterComponent />
                <div className="profile-container">
                    <h2>{userData.name}</h2>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Projects Involved:</strong> {userData.projects.length}</p>
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default ProfileComponent;
