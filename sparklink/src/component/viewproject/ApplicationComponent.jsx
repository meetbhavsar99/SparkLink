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
    const [currentPage, setCurrentPage] = useState(1);
    const applicationsPerPage = 10;


    useEffect(() => {
        if (user?.user_id) {
            fetchApplications();
        }
    }, [user]);


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

    const indexOfLastApp = currentPage * applicationsPerPage;
    const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
    const currentApplications = applications.slice(indexOfFirstApp, indexOfLastApp);

    const totalPages = Math.ceil(applications.length / applicationsPerPage);


    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent />
                    <MasterComponent />
                    <div className="container-fluid">
                        <h2 className="application-title display-4">My Project Applications</h2>

                        <button className="btn btn-lg refresh-button" onClick={fetchApplications}>
                            Refresh
                        </button>

                        {loading ? (
                            <div className="loading">Loading Applications...</div>
                        ) : applications.length === 0 ? (
                            <div className="no-applications">You have no project applications yet.</div>
                        ) : (
                            <table className="table table-striped table-hover application-table">
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
                                    {currentApplications.map((app, index) => (
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
                        {totalPages > 1 && (
                        <div className="pagination-container d-flex justify-content-center mt-3">
                            <button
                            className="btn btn-outline-primary mx-1"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                            Previous
                            </button>

                            <span className="align-self-center mx-2">Page {currentPage} of {totalPages}</span>

                            <button
                            className="btn btn-outline-primary mx-1"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                            Next
                            </button>
                        </div>
                        )}

                    </div>
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default ApplicationComponent;
