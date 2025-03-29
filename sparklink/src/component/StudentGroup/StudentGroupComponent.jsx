import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import FooterComponent from "../footer/FooterComponent";
import "./StudentGroupComponent.css";

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

const imageArray = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

const StudentGroupComponent = () => {
  const [groupId, setGroupId] = useState("");
  const [groupInfo, setGroupInfo] = useState(null);
  const [resume, setResume] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [groupProjects, setGroupProjects] = useState([]);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchGroupInfo();
  }, []);

  const fetchGroupInfo = async () => {
    try {
      const response = await axios.get("/api/group/my", { withCredentials: true });
      const { group, isLeader } = response.data;
      if (group) {
        setGroupInfo(group);
        setIsLeader(isLeader);
      } else {
        setGroupInfo(null);
        setIsLeader(false);
      }
    } catch (err) {
      console.error("Error fetching group info:", err);
      setGroupInfo(null);
      setIsLeader(false);
    }
  };

  const createGroup = async () => {
    try {
      const res = await axios.post("/api/group/create", {}, { withCredentials: true });
      alert(`Group created! Group ID: ${res.data.group_id}`);
      fetchGroupInfo();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating group");
    }
  };

  const joinGroup = async () => {
    if (!groupId.trim()) return alert("Enter valid Group ID");
    try {
      await axios.post("/api/group/join", { group_id: groupId }, { withCredentials: true });
      alert("Joined group successfully!");
      fetchGroupInfo();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  const leaveGroup = async () => {
    try {
      await axios.post("/api/group/leave", {}, { withCredentials: true });
      alert("You have left the group.");
      setGroupInfo(null);
      setGroupId("");
    } catch (err) {
      alert("Error leaving group.");
    }
  };

  const handleUpload = async () => {
    if (!resume) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("pdf", resume);
    try {
      await axios.post("/api/group/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess("Resume uploaded successfully!");
      fetchGroupInfo();
    } catch (err) {
      alert("Failed to upload resume.");
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await axios.get("/api/group/view-resume", {
        withCredentials: true,
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "merged_resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download resume.");
    }
  };

  const fetchGroupProjects = async () => {
    try {
      const response = await axios.get("/api/group/my-projects", { withCredentials: true });
      setGroupProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching group projects:", error);
    }
  };

  useEffect(() => {
    if (groupInfo) {
      fetchGroupProjects();
    }
  }, [groupInfo]);

  return (
    <div className="studentgroup-page">
      <div className="studentgroup-content">
        <MenuComponent />
        <MasterComponent />
        <h2 className="group-title display-4">Student Group Management</h2>
        <div className="group-container">
          {!groupInfo && (
            <div className="group-actions">
              <button onClick={createGroup}>Create Group</button>
              <input
                type="text"
                placeholder="Enter Group ID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
              <button onClick={joinGroup}>Join Group</button>
              {error && <p style={{ color: "gray", marginTop: "1rem" }}>{error}</p>}
            </div>
          )}
          {groupInfo && (
            <div className="group-details">
              <h4>Group ID: {groupInfo.group_id}</h4>
              <p>
                <strong>Team Leader:</strong> {groupInfo.team_leader_name || "N/A"}
              </p>
              <h5>Members:</h5>
              {groupInfo.members && groupInfo.members.length > 0 ? (
                <ul>
                  {groupInfo.members.map((member) => (
                    <li key={member.user_id}>
                      {member.username} {member.is_leader ? "(Leader)" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members in this group yet.</p>
              )}
              <div className="upload-section">
                <h5>Upload Merged Resume PDF</h5>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <button className="upload-btn" onClick={handleUpload}>
                  Upload
                </button>
                {uploadSuccess && <p className="success-msg">{uploadSuccess}</p>}
                {groupInfo.resume_url && (
                  <p>
                    <button className="download-btn" onClick={handleDownloadResume}>
                      Download Uploaded Resume
                    </button>
                  </p>
                )}
              </div>
              <button className="leave-btn" onClick={leaveGroup}>
                Leave Group
              </button>
            </div>
          )}
          {groupProjects.length > 0 && (
            <div className="group-projects-section">
              <h3>Projects Your Group is Working On</h3>
              <div className="project-card-container">
                {groupProjects.map((project) => (
                  <div
                    className="student-project-card"
                    key={project.proj_id}
                    onClick={() => openModal(project)}
                  >
                    <div
                      className="project-image"
                      style={{
                        backgroundImage: `url(${imageArray[Number(project.image_url)] || ""})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "200px",
                      }}
                    ></div>
                    <div className="project-info">
                      <h5>{project.project_name}</h5>
                      <p>{project.description?.substring(0, 100) || "No description available."}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Modal show={showModal} onHide={closeModal} size="xl" scrollable>
                <Modal.Header closeButton>
                  <Modal.Title>Project Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedProject && (
                    <Table responsive bordered hover>
                      <tbody>
                        <tr>
                          <td colSpan={2}>
                            <strong>Project Name:</strong> {selectedProject.project_name}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Description</strong></td>
                          <td>{selectedProject.description}</td>
                        </tr>
                        <tr>
                          <td><strong>Features</strong></td>
                          <td>{selectedProject.features}</td>
                        </tr>
                        <tr>
                          <td><strong>Skills Required</strong></td>
                          <td>{selectedProject.skills_req}</td>
                        </tr>
                        <tr>
                          <td><strong>Budget</strong></td>
                          <td>{selectedProject.budget}</td>
                        </tr>
                        <tr>
                          <td><strong>End Date</strong></td>
                          <td>{new Date(selectedProject.end_date).toLocaleDateString()}</td>
                        </tr>
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
      </div>
      <FooterComponent />
    </div>
  );
};

export default StudentGroupComponent;
