import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import "./ViewAllGroupComponent.css";

const ViewAllGroupsComponent = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("/api/group/admin-view", {
        withCredentials: true,
      });
      console.log("Fetched groups ->", res.data.groups[0]);
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleDownload = async (groupId) => {
    try {
      const res = await axios.get(
        `/api/group/admin-download-resume?groupId=${groupId}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_resume.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
      alert("Resume not found or access denied.");
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.group_id.toString().includes(searchTerm.trim())
  );

  return (
    <div className="viewallgroups-page">
      <div className="viewallgroups-content">
        <MenuComponent />
        <MasterComponent />
        <h2 className="group-title display-4">All Student Groups</h2>
        <div className="search-bar mb-3">
          <input
            type="text"
            placeholder="Search by Group ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ maxWidth: "250px", display: "inline-block" }}
          />
        </div>
        <div className="group-container">
          {filteredGroups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group_id} className="group-details mb-4">
                <h4>Group ID: {group.group_id}</h4>
                <p>
                  <strong>Team Leader:</strong>{" "}
                  {group.members.find((m) => m.is_leader)?.username || "N/A"}
                </p>
                <p>
                  <strong>Members:</strong>
                </p>
                <ul>
                  {group.members.map((m) => (
                    <li key={m.user_id}>
                      {m.username} {m.is_leader ? "(Leader)" : ""}
                    </li>
                  ))}
                </ul>
                {group.resume_url ? (
                  <button
                    className="btn"
                    onClick={() => handleDownload(group.group_id)}
                  >
                    Download Resume
                  </button>
                ) : (
                  <p>No resume uploaded.</p>
                )}
                {group.applied_projects &&
                  group.applied_projects.length > 0 && (
                    <>
                      <p className="mt-3">
                        <strong>Applied Projects (with Priority):</strong>
                      </p>
                      <div className="priority-card-container">
                        {group.applied_projects.map((proj) => (
                          <div
                            key={proj.proj_id}
                            className="priority-project-card"
                          >
                            <h5 className="priority-project-title">
                              {proj.project_name}
                            </h5>
                            <div className="priority-level">
                              Priority: <span>{proj.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ViewAllGroupsComponent;
