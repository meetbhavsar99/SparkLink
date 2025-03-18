import React, { useState, useEffect } from 'react';
import './ViewProjectComponent.css';
import MenuComponent from '../menu/MenuComponent';
import MasterComponent from '../MasterComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import edit_icon from '../../assets/edit_icon.png';
import cancel_icon from '../../assets/cancel_icon.png';
import complete_icon from '../../assets/complete_icon.png';
import resume_icon from '../../assets/resume_icon.png';
import delay_icon from '../../assets/delay_icon.png';
import fail_icon from '../../assets/fail_icon.png';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from "../../notificationContext";
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


const ViewProjectComponent = () => {
    const navigate = useNavigate();
    const { updateNotifyCount } = useNotification();
    const [projectList, setProjectList] = useState([]);
    const [originalProjectList, setOriginalProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projDetailsList, setProjDetailsList] = useState({});
    const [copyOfProjDetailsList, setCopyOfProjDetailsList] = useState({});
    const [triggerModalFlag, setTriggerModalFlag] = useState(false);
    const [triggerDetails, setTriggerDetails] = useState(false);
    //const [isMobileView, setIsMobileView] = useState(false);
    const [editFlag, setEditFlag] = useState(false);
    const [projDescList, setProjDescList] = useState([]);
    const [copyOfProjDescList, setCopyOfProjDescList] = useState([]);
    const [tempProjDescList, setTempProjDescList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { isAuthenticated } = useAuth();
    const { user } = useAuth();
    const [userData, setUserData] = useState({});
    const [accessVal, setAccessVal] = useState('');
    const today = new Date().toISOString().split("T")[0];
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 8; // Change for more/less projects per page  

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projectList.slice(indexOfFirstProject, indexOfLastProject);


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobileView(window.innerWidth < 768);
    //     };

    //     handleResize();

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // const fetchProjects = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get('/project/getAllProjects');
    //         console.log(`API response: ${response.data}`);
    //         setProjectList(response.data.projects);
    //         setOriginalProjectList(response.data.projects);
    //         if (isAuthenticated) {
    //             setUserData(response.data.user);
    //         }
    //     } catch (err) {
    //         Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
    //         //setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

//     const fetchProjects = async () => {
//     setLoading(true);
//     try {
//         const token = localStorage.getItem("authToken"); // ✅ Get the token from localStorage
//         const response = await axios.get('/project/getAllProjects', { 
//             headers: { Authorization: `Bearer ${token}` } // ✅ Send Auth Header
//         });

//         console.log(`🟢 API response: ${response.data}`);
//         setProjectList(response.data.projects);
//         setOriginalProjectList(response.data.projects);
        
//         if (isAuthenticated) {
//             setUserData(response.data.user);
//         }
//     } catch (err) {
//         console.error("❌ Error fetching projects:", err);
//         Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message, icon: 'error', confirmButtonText: 'Ok' });
//     } finally {
//         setLoading(false);
//     }
// };

const fetchProjects = async () => {
    setLoading(true);
    try {
        console.log("🔵 Fetching all projects...");
        
        const response = await axios.get('/project/getAllProjects', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent
            }
        });

        setProjectList(response.data.projects);
        setOriginalProjectList(response.data.projects);

        if (isAuthenticated) {
            setUserData(response.data.user);
        }
    } catch (err) {
        console.error("❌ Error fetching projects:", err);
        Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
    } finally {
        setLoading(false);
    }
};



    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get('/project/filter', {
                params: { projName: query },
            });

            const formattedSuggestions = response.data.map((suggestion) => ({
                label: suggestion.project_name,
                value: suggestion.project_name,
            }));
            setSuggestions(formattedSuggestions);
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
            //setError(err.message);
        }
    };

    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
        if (inputValue.trim()) {
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    };
    // const handleInputChange = (inputValue) => {
    //     setSearchQuery(inputValue);
        
    //     if (inputValue.trim() === '') {
    //         setProjectList(originalProjectList);
    //     } else {
    //         const filteredProjects = originalProjectList.filter((project) =>
    //             project.project_name.toLowerCase().startsWith(inputValue.toLowerCase())
    //         );
    //         setProjectList(filteredProjects);
    //     }
    // };
    

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        if (selectedOption) {
            setSearchQuery(selectedOption.label);

            const filteredProjects = originalProjectList.filter((item) =>
                item.project_name && selectedOption.value &&
                item.project_name.toLowerCase() === selectedOption.value.toLowerCase()
            );
            setProjectList(filteredProjects);
        } else {
            setSearchQuery('');
            setSuggestions([]);
            setProjectList(originalProjectList);
        }
    };

    const openProjectDetails = (projId) => {
    let filteredProj = null;

    for (let i = 0; i < projectList.length; i++) {
        if (projectList[i].proj_id === projId) {
            filteredProj = projectList[i];

            // Ensure stakeholders are mapped correctly
            if (filteredProj.stakeholder && Array.isArray(filteredProj.stakeholder)) {
                filteredProj.stakeholder = filteredProj.stakeholder.map(stakeholder => ({
                    ...stakeholder,
                    name: stakeholder.name || "Unknown Name", // Handle missing names
                }));
            }

            setProjDetailsList(filteredProj);
            console.log("Selected Project Details:", filteredProj); // Debugging Stakeholder Data
            console.log("Stakeholder Data:", filteredProj.stakeholder); // Log Stakeholder Array
            setTriggerModalFlag(true);
            break;
        }
    }
};



    useEffect(() => {
        if (triggerModalFlag && projDetailsList && projDetailsList.proj_id) {
            fetchUserRoles();
        }
    }, [triggerModalFlag]);

    const closeModal = () => {
        setProjDetailsList(null);
        //setProjDescList([]);
        setTriggerDetails(false);
        setTriggerModalFlag(false);
        setEditFlag(false);
    }

    const triggerUpdate = async (triggerKey) => {
        if (triggerKey === 'U') {
            setEditFlag(true);
            setCopyOfProjDetailsList(projDetailsList);
            //setCopyOfProjDescList(projDescList);
        } else if (triggerKey === 'C') {
            setEditFlag(false);
            setProjDetailsList(copyOfProjDetailsList);
            //setProjDescList(copyOfProjDescList);
        }
    }

    const UpdateProjDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/project/updateProject", {
                projDetailsList: projDetailsList
            });

            console.log(response.data);
            if (response.status === 200) {
                if (editFlag) {
                    setEditFlag(false);
                }
                Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
            } else if (response.status === 500) {
                Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
            } else if (response.status === 400) {
                Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
            }
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    title: 'Error',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: err.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            //setError(err.message);
        } finally {
            setLoading(false);
            fetchProjects();
        }
    }

    // const handleUpdateProjDescChange = (event) => {
    //     const { name, value } = event.target;

    //     const updatedTempProjDescList = tempProjDescList.map((p) => {
    //         if (p[0] === name) {
    //             return [p[0], value];
    //         }
    //         return p;
    //     });

    //     setTempProjDescList(updatedTempProjDescList);
    // };

    // const handleProjDescBlur = () => {
    //     const trimmedProjDescList = tempProjDescList.map(p => [p[0].trim(), p[1].trim()]);
    //     setProjDescList(trimmedProjDescList);

    //     setProjDetailsList(prevDetails => {
    //         const updatedProjDescString = trimmedProjDescList
    //             .map(p => `${p[0]}: ${p[1]}`)
    //             .join('; ');
    //         return { ...prevDetails, proj_desc: updatedProjDescString };
    //     });
    // };

    // useEffect(() => {
    //     setTempProjDescList(projDescList);
    // }, [projDescList]);

    const handleUpdateProjDetailsChange = (event) => {
        const { name, value } = event.target;

        setProjDetailsList(prevDetails => {
            return { ...prevDetails, [name]: value };
        });
    };

    const deleteProject = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Delete this project? This change cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    console.log("🔴 Sending delete request for project:", projDetailsList); 

                    const response = await axios.post('/project/deleteProject', {
                        projData: projDetailsList
                    });

                    console.log("🟢 API Response:", response.data); // ✅ Log the response

                    if (response.status === 200) {
                        //fetchProjects();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    } else if (response.status === 500) {
                        Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    closeModal();
                    fetchProjects();
                    //setLoading(false);
                }
            }
        });
    }

    const completeProject = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to mark this Project as Completed?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/project/completeProject', {
                        projData: projDetailsList
                    });

                    if (response.status === 200) {
                        //fetchProjects();
                        closeModal();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    } else if (response.status === 500) {
                        Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    fetchProjects();
                    //setLoading(false);
                }
            }
        });
    }

    const resumeProject = async () => {
        //setLoading(true);
        try {
            const response = await axios.post('/project/resumeProject', {
                projData: projDetailsList
            });

            if (response.status === 200) {
                //fetchProjects();
                closeModal();
                Swal.fire({ title: 'Success', icon: 'success', confirmButtonText: 'Ok' });
            } else if (response.status === 500) {
                Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
            }
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
            //setError(err.message);
        } finally {
            fetchProjects();
            //setLoading(false);
        }
    }

    const cancelProject = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Cancel this project?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/project/cancelProject', {
                        projData: projDetailsList
                    });

                    if (response.status === 200) {
                        //fetchProjects();
                        closeModal();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    } else if (response.status === 500) {
                        Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    fetchProjects();
                    //setLoading(false);
                }
            }
        });
    }

    const delayProject = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Delay this project?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/project/delayProject', {
                        projData: projDetailsList
                    });

                    if (response.status === 200) {
                        //fetchProjects();
                        closeModal();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    } else if (response.status === 500) {
                        Swal.fire({ title: 'Error', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    fetchProjects();
                    //setLoading(false);
                }
            }
        });
    }

    const removeStakeholder = async (proj_id, role, user_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove them from the project? This change cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const removeObj = {
                        proj_id: proj_id,
                        role: role,
                        user_id: user_id
                    }
                    const response = await axios.post('/project/removeStakeholder', {
                        removeData: removeObj
                    });
                    if (response.status === 200) {
                        //fetchProjects();
                        closeModal();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    }
                } catch (error) {
                    Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonText: 'Ok' });
                } finally {
                    closeModal();
                    fetchProjects();
                }
            }
        });
    }

    // const submitApplication = async () => {
    //     setLoading(true);
    //     try {
    //         console.log("🟢 Applying for project:", projDetailsList.proj_id, "User:", user?.user_id);
    //         const response = await axios.post('/project/applyProject', {
    //             proj_id: projDetailsList.proj_id
    //             // user_id: user?.user_id
    //         });
    //         console.log("✅ Apply API Response:", response.data);
            
    //         if (response.status === 200 && response.data.success) {
    //             //fetchProjects();
    //             closeModal();
    //             Swal.fire({ title: 'Application Successful', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
    //             updateNotifyCount();
    //         } else if (response.status === 200 && !response.data.success) {
    //             //fetchProjects();
    //             closeModal();
    //             Swal.fire({ title: 'Application Unsuccessful', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
    //         }
    //     } catch (error) {
    //         Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonText: 'Ok' });
    //         //setError(error.message);
    //     } finally {
    //         fetchProjects();
    //         //setLoading(false);
    //     }
    // }
    const submitApplication = async () => {
    setLoading(true);
    try {
        console.log("🟢 Applying for project:", projDetailsList.proj_id, "User:", user?.user_id);

        const response = await axios.post('/project/applyProject', {
            proj_id: projDetailsList.proj_id,
            user_id: user?.user_id // ✅ Ensure user_id is sent
        });

        console.log("✅ Apply API Response:", response.data);

        if (response.status === 200 && response.data.success) {
            closeModal();
            Swal.fire({ title: 'Application Successful', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
            updateNotifyCount();
        } else if (response.status === 200 && !response.data.success) {
            closeModal();
            Swal.fire({ title: 'Application Unsuccessful', text: response.data.message, icon: 'error', confirmButtonText: 'Ok' });
        }
    } catch (error) {
        console.error("❌ Error applying for project:", error); // ✅ Log error details
        Swal.fire({ title: 'Error', text: error.response?.data?.message || error.message, icon: 'error', confirmButtonText: 'Ok' });
    } finally {
        fetchProjects();
    }
};


    const fetchUserRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/project/getUserRoleAccess', {
                proj_id: projDetailsList.proj_id,
                user_id: user?.user_id // Ensure user_id is sent
            });
            if (response.status === 200) {
                setTriggerDetails(true);
                setAccessVal(response.data.access_val);
            }
            //setAccessVal(response.data.access_val);
        } catch (error) {
            console.error("Error fetching user role access:", error);
            Swal.fire({ title: 'Error', text: error.response?.data?.message || "Error fetching access permissions", icon: 'error', confirmButtonText: 'Ok' });
            //setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUserProfile = async (user_id) => {
        setLoading(true);
        try {
            const response = await axios.get('/profile', {
                params: { user_id: user_id }
            });

            if (response.status === 200) {
                navigate(`/profile?user_id=${user_id}`);
            }
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonText: 'Ok' });
        } finally {
            setLoading(false);
        }
    }

    const viewMilestones = async () => {
        navigate("/progress", { state: { projId: projDetailsList.proj_id } });
    }

    const reportProject = async () => {
        Swal.fire({
            title: 'Please enter a reason',
            input: 'text',
            inputPlaceholder: 'Enter your reason for reporting this project',
            showCancelButton: true,
            confirmButtonText: 'Submit Report',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const reason = result.value;

                    const reportData = {
                        proj_id: projDetailsList.proj_id,
                        reason: reason
                    }

                    const response = await axios.post('/project/reportProject', {
                        reportData: reportData
                    });

                    if (response.status === 200) {
                        closeModal();
                        Swal.fire({ title: 'Success', text: response.data.message, icon: 'success', confirmButtonText: 'Ok' });
                    }
                } catch (error) {
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
                    setLoading(false);
                }
            }
        });
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent />
                    <MasterComponent />
                    <div className="container-fluid mb-5">
                        <div className="progress_container">
                            <div className="row">
                                <div className="col-lg-1 col-md-1 col-sm-3"></div>
                                <div className="col-lg-11 col-md-11 col-sm-9">
                                    <div className="progress-tracker">
                                    <div className="search-container">
                                            <input 
                                                type="text" 
                                                className="search-input"
                                                placeholder="🔍 Search for a project..." 
                                                value={searchQuery}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                            />
                                        </div>
                
                                        <div className="progress-background-card">
                                        <div className="row progress-card-layout">
                                            {currentProjects.map((item, index) => {
                                                return (
                                                    <div className="col-8 col-md-4 col-sm-10 col-lg-2 px-4 progress-card mb-4 mt-3" 
                                                        title={item.project_name}
                                                        key={index} 
                                                        onClick={() => openProjectDetails(item.proj_id)}
                                                    >
                                                        <div className="progress-image"
                                                            style={{
                                                                backgroundImage: `url(${imageArray[Number(item.image_url)] || ''})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'
                                                            }}
                                                            loading="lazy">
                                                        </div>
                                                        <div className="progress-content">
                                                            <div className="progress-title">{item.project_name.length > 15
                                                                ? `${item.project_name.slice(0, 18)}...`
                                                                : item.project_name}</div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div className="progress" style={{ width: `${item.progress}%` }}></div>
                                                                </div>
                                                                <span className="progress-text">{item.progress}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="pagination-container">
                                        <button 
                                            className="ms-3 text-center button-text button-main button-main:disabled"  
                                            onClick={() => setCurrentPage(currentPage - 1)} 
                                            disabled={currentPage === 1}
                                        >
                                            ◀ Previous
                                        </button>

                                        <span className="pagination-text"> Page {currentPage} of {Math.ceil(projectList.length / projectsPerPage)} </span>

                                        <button 
                                            className="ms-3 text-center button-text button-main" 
                                            onClick={() => setCurrentPage(currentPage + 1)} 
                                            disabled={currentPage >= Math.ceil(projectList.length / projectsPerPage)}
                                        >
                                            Next ▶
                                        </button>
                                    </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal
                            size="xl"
                            show={triggerDetails}
                            onHide={closeModal}
                            onEscapeKeyDown={closeModal}
                            scrollable
                            aria-labelledby="milestone_details_modal"
                            autoFocus={false}
                            enforceFocus={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                    Project Details
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {projDetailsList && (
                                    <>
                                        <Table responsive='sm' bordered hover>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={12} className='proj-details-header' title={projDetailsList.project_name}>Project Name: {projDetailsList?.project_name
                                                        ? projDetailsList.project_name.length > 25
                                                            ? `${projDetailsList.project_name.slice(0, 25)}...`
                                                            : projDetailsList.project_name
                                                        : "N/A"}
                                                        {(accessVal === 'E' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag &&
                                                            <span className='ms-1'><img
                                                                src={report_icon}
                                                                className='complete_icon'
                                                                title='Report Project'
                                                                onClick={reportProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag &&
                                                            (projDetailsList.status !== 7 && projDetailsList.status !== 5 && projDetailsList.status !== 3 && projDetailsList.status !== 2 && projDetailsList.status !== 1) &&
                                                            <span className='ms-1' style={{ float: 'right' }}><img
                                                                src={fail_icon}
                                                                className='complete_icon'
                                                                title='Mark Project as Cancelled'
                                                                onClick={cancelProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag &&
                                                            (projDetailsList.status !== 6 && projDetailsList.status !== 5 && projDetailsList.status !== 3 && projDetailsList.status !== 2 && projDetailsList.status !== 1) &&
                                                            <span className='ms-1' style={{ float: 'right' }}><img
                                                                src={delay_icon}
                                                                className='complete_icon'
                                                                title='Mark Project as Delayed'
                                                                onClick={delayProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag && (projDetailsList.status === 4 || projDetailsList.status === 6) &&
                                                            <span className='ms-1' style={{ float: 'right' }}><img
                                                                src={complete_icon}
                                                                className='complete_icon'
                                                                title='Mark Project as Complete'
                                                                onClick={completeProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag &&
                                                            (projDetailsList.status === 5 || projDetailsList.status === 6 || projDetailsList.status === 7) &&
                                                            <span className='ms-1' style={{ float: 'right' }}><img
                                                                src={resume_icon}
                                                                className='complete_icon'
                                                                title='Resume Project'
                                                                onClick={resumeProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag && projDetailsList.status === 3 &&
                                                            <span className='ms-1' style={{ float: 'right' }}><img
                                                                src={resume_icon}
                                                                className='complete_icon'
                                                                title='Start Project'
                                                                onClick={resumeProject}
                                                                alt=''
                                                            /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && !editFlag &&
                                                            <span style={{ float: 'right' }}><img src={edit_icon} className='edit_icon'
                                                                title='Click to edit Project Details' alt=""
                                                                onClick={() => triggerUpdate('U')} /></span>}
                                                        {(accessVal === 'E' || accessVal === 'B' || accessVal === 'S' || accessVal === 'SB' || accessVal === 'SBA') && editFlag &&
                                                            <span style={{ float: 'right' }}><img src={cancel_icon} className='cancel_icon'
                                                                title='Click to cancel editing' alt=''
                                                                onClick={() => triggerUpdate('C')}
                                                            /></span>}
                                                    </td>
                                                </tr>
                                                {/* {projDescList.map((p, i) => (
                                                    <tr key={`projDesc-${i}`}>
                                                        {!editFlag && <>
                                                            <td className='proj-details-sub-header'>{p[0]}</td>
                                                            <td className='proj-details-data'>{p[1]}</td>
                                                        </>}
                                                        {editFlag && <>
                                                            <td className='proj-details-sub-header'>{p[0]}</td>
                                                            <td className='proj-details-data'>
                                                                <input
                                                                    type="text"
                                                                    className="milestone_input_text"
                                                                    name={`${p[0]}`}
                                                                    value={tempProjDescList.find(item => item[0] === p[0])?.[1] || ""}
                                                                    onChange={(e) => handleUpdateProjDescChange(e)}
                                                                    onBlur={handleProjDescBlur}
                                                                    placeholder={`Enter ${p[0]}`}
                                                                    maxLength={100}
                                                                    required
                                                                />
                                                            </td>
                                                        </>}
                                                    </tr>
                                                ))} */}
                                                <tr>
                                                    <td className="proj-details-sub-header">Purpose</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.purpose}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="text"
                                                            className="milestone_input_text"
                                                            name="purpose"
                                                            placeholder='e.g., E-Commerce'
                                                            value={projDetailsList.purpose || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>
                                                <tr>
                                                    <td className="proj-details-sub-header">Type of Product</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.product}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="text"
                                                            className="milestone_input_text"
                                                            name="product"
                                                            placeholder='e.g., Website'
                                                            value={projDetailsList.product || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>
                                                <tr>
                                                    <td className="proj-details-sub-header">Description</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.description}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="text"
                                                            className="milestone_input_text"
                                                            name="description"
                                                            placeholder='e.g., This website is intended for MAC Faculty and Students'
                                                            value={projDetailsList.description || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>
                                                <tr>
                                                    <td className="proj-details-sub-header">Category</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.category || "N/A"}</td>} {/* ✅ Handle undefined */}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="text"
                                                            className="milestone_input_text"
                                                            name="category"
                                                            placeholder='Category'
                                                            value={projDetailsList.category || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>

                                                <tr>
                                                    <td className="proj-details-sub-header">Features</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.features}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="text"
                                                            className="milestone_input_text"
                                                            name="features"
                                                            placeholder='e.g., Recommendation System'
                                                            value={projDetailsList.features || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>
                                                <tr>
                                                    <td className="proj-details-sub-header">Budget (in Dollars)</td>
                                                    {!editFlag && <td className='proj-details-data'>{Math.trunc(projDetailsList.budget)}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="number"
                                                            className="milestone_input_text"
                                                            name="budget"
                                                            placeholder='e.g., 5000'
                                                            min="0"
                                                            value={Math.trunc(projDetailsList.budget) || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
                                                </tr>
                                                                                                {/* Display both AI skills and submitted skills */}
                                                {projDetailsList.skills_req || projDetailsList.submitted_skills ? (
                                                    <tr>
                                                        <td className="proj-details-sub-header">Skills</td>
                                                        <td className="proj-details-data">
                                                            {projDetailsList.skills_required && (
                                                                <div><strong>Submitted:</strong> {projDetailsList.skills_required}</div>
                                                            )}
                                                            {projDetailsList.skills_req && (
                                                                <div><strong>Suggested:</strong> {projDetailsList.skills_req}</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                <tr>
                                                <td className='proj-details-sub-header'>Deadline</td>
                                                        {!editFlag && (
                                                            <td className='proj-details-data'>
                                                                {new Date(projDetailsList.end_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </td>
                                                        )}
                                                        {editFlag && (
                                                            <td className='proj-details-data'>
                                                                <input
                                                                    type="date"
                                                                    className="milestone_input_date milestone_datepicker"
                                                                    name="end_date"
                                                                    min={today}
                                                                    value={projDetailsList.end_date ? projDetailsList.end_date.split('T')[0] : ""}
                                                                    onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                                    required
                                                                />
                                                            </td>
                                                        )}
                                                </tr>
                                                {/* Display only if number of students is available */}
                                                                     {projDetailsList.num_students && (
                                                                         <tr>
                                                                             <td className="proj-details-sub-header">Number of Students</td>
                                                                             <td className="proj-details-data">{projDetailsList.num_students}</td>
                                                                         </tr>
                                                                     )}
                     
                                                                     {/* Display files if available */}
                                                                     {projDetailsList.files && projDetailsList.files.length > 0 && (
                                                                         <tr>
                                                                             <td className="proj-details-sub-header">Files</td>
                                                                             <td className="proj-details-data">
                                                                                 {projDetailsList.files.map((file, index) => (
                                                                                     <div key={index}>
                                                                                         <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                                             {`file.name || File ${index + 1}`}
                                                                                         </a>
                                                                                     </div>
                                                                                 ))}
                                                                             </td>
                                                                         </tr>
                         )}
                                                
{["admin", "business_owner", "supervisor", "student"].map(role => {
    const stakeholdersByRole = (projDetailsList?.stakeholder || []).filter(
        stakeholder => stakeholder.role === role
    );

    if (stakeholdersByRole.length > 0) {
        return (
            <tr key={role}>
                <td className="proj-details-sub-header">
                    {role === "admin" && "Admin"}
                    {role === "business_owner" && "Business Owner"}
                    {role === "supervisor" && "Supervisor(s)"}
                    {role === "student" && "Student(s)"}
                </td>
                <td className="proj-details-data">
                    {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                        <div
                            key={`${role}-${user_id}`}
                            className="stakeholder-button"
                            onClick={() => fetchUserProfile(user_id)} // Navigate to profile on click
                        >
                            {name}
                            {editFlag &&
                                (((accessVal === "E" || accessVal === "SB") && role === "student") ||
                                    (accessVal === "S" && role !== "business_owner")) && (
                                    <img
                                        src={remove_icon}
                                        onClick={() => removeStakeholder(proj_id, role, user_id)}
                                        className="remove_icon"
                                        alt=""
                                    />
                                )}
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
                                        <div className="message">
                                            {errorMessage && (
                                                <div className="error-message">{errorMessage}</div>
                                            )}
                                            {successMessage && (
                                                <div className="success-message">{successMessage}</div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <button className="ms-3 text-center button_text button-main"
                                            onClick={closeModal}>Close</button>
                                        {editFlag && <button className="ms-3 text-center button_text button-main"
                                            onClick={UpdateProjDetails}>Save Changes</button>}
                                        {(accessVal === 'A' || accessVal === 'SBA') && <button className="ms-3 text-center button_text button-main"
                                            onClick={submitApplication}>Click to Apply</button>}
                                        {(accessVal === 'S' || accessVal === 'E' || accessVal === 'M' || accessVal === 'B' || accessVal === 'SB') && <button className="ms-3 text-center button_text button-main
                                        "
                                            onClick={viewMilestones}>View Milestones</button>}
                                        {(accessVal === 'S' || accessVal === 'B' || accessVal === 'SB' || accessVal === 'SBA') && <button className="ms-3 text-center button_text button-delete"
                                            onClick={deleteProject}>Delete Project</button>}
                                    </div>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>

                                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">
                            <div className="spinner-icon">
                                <div className="spinner-border" role="status"></div>
                            </div>
                            <div className="loading-text">⏳ Please wait, we’re processing your request...</div>
                        </div>
                    </div>
                )}


                <div className="footer-fixed">
                    <FooterComponent />
                </div>
            </div>
        </>
    );
};

export default ViewProjectComponent;
