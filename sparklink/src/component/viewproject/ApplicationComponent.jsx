import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import "./ApplicationComponent.css"; 
import Swal from "sweetalert2";

const ApplicationComponent = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            console.log("🔵 Fetching applications for student:", user.user_id);

            const response = await axios.get(`/project/getStudentApplications`, {
                params: { user_id: user.user_id },
            });

            console.log("✅ Applications:", response.data);
            setApplications(response.data);
        } catch (error) {
            console.error("❌ Error fetching applications:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to load applications",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent />
                    <MasterComponent />
                    <div className="container-fluid">
                        <h2 className="application-title">My Project Applications</h2>

                        <button className="refresh-button" onClick={fetchApplications}>
                            🔄 Refresh Applications
                        </button>

                        {loading ? (
                            <div className="loading">Loading Applications...</div>
                        ) : applications.length === 0 ? (
                            <div className="no-applications">You have no project applications yet.</div>
                        ) : (
                            <table className="application-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Description</th>
                                        <th>Purpose</th>
                                        <th>Product</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app, index) => (
                                        <tr key={index}>
                                            <td>{app.project_name}</td>
                                            <td>{app.description}</td>
                                            <td>{app.purpose}</td>
                                            <td>{app.product}</td>
                                            <td>{new Date(app.applied_on).toLocaleDateString()}</td>
                                            <td className={`status-${app.status.toLowerCase().replace(/\s/g, "-")}`}>
                                                {app.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default ApplicationComponent;
