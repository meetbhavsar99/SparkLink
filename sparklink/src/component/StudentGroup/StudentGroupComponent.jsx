import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from '../menu/MenuComponent';
import MasterComponent from '../MasterComponent';
import FooterComponent from '../footer/FooterComponent';
import "./StudentGroupComponent.css";

const StudentGroupComponent = () => {
  const [groupId, setGroupId] = useState("");
  const [groupInfo, setGroupInfo] = useState(null);
  const [resume, setResume] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [error, setError] = useState("");

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
      setGroupInfo(null); // This is important
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
      responseType: "blob", // important for binary files
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "merged_resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl); // cleanup
  } catch (err) {
    console.error("Download failed", err);
    alert("Failed to download resume.");
  }
};



  return (
    <div className="content-container">
      <MenuComponent />
      <MasterComponent />
      <h2 className="group-title display-4">Student Group Management</h2>
      <div className="group-container">

        {/* Create or Join Group */}
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

        {/* Group Management View */}
        {groupInfo && (
          <div className="group-details">
            <h4>Group ID: {groupInfo.group_id}</h4>
            <p><strong>Team Leader:</strong> {groupInfo.team_leader_name || "N/A"}</p>

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

            {/* Upload Section - Available to All Group Members */}
            <div className="upload-section">
              <h5>Upload Merged Resume PDF</h5>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />
              <button className="upload-btn" onClick={handleUpload}>Upload</button>
              {uploadSuccess && <p className="success-msg">{uploadSuccess}</p>}
              {groupInfo.resume_url && (
                <p>
                    <button className="download-btn" onClick={handleDownloadResume}>
                    Download Uploaded Resume
                    </button>
                </p>
              )}
            </div>

            {/* Leave Button */}
            <button className="leave-btn" onClick={leaveGroup}>
              Leave Group
            </button>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default StudentGroupComponent;
