import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./logs.css";

const LogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLogType, setSelectedLogType] = useState("all");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAction, setSearchAction] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [selectedLogType]);

  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        log_type: selectedLogType !== "all" ? selectedLogType : "",
        user_id: searchUserId,
        date: searchDate,
        action: searchAction,
      });
      const response = await axios.get(`/api/logs/filter?${queryParams.toString()}`);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
      <div className="page-container">
        <div className="content-container">
          <MenuComponent />
          <MasterComponent />
          <div className="container mt-4">
            <h1 className="mb-4">System Logs & Activity Tracking</h1>
  
            {/* 🔎 Search Filters */}
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by User ID"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                />
              </div>
  
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
  
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Action"
                  value={searchAction}
                  onChange={(e) => setSearchAction(e.target.value)}
                />
              </div>
  
              <div className="col-md-3">
                <button className="btn btn-primary" onClick={fetchLogs}>
                  Search
                </button>
              </div>
            </div>
  
            {/* Dropdown for Log Type */}
            <select className="form-control mb-3" onChange={(e) => setSelectedLogType(e.target.value)}>
              <option value="all">All Logs</option>
              <option value="user">User Logs</option>
              <option value="action">Action Logs</option>
              <option value="error">Error Logs</option>
            </select>
  
            {/* Logs Table */}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User ID</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                      <tr key={log.log_id}>
                          <td>
                              {log.created_at && Date.parse(log.created_at) 
                                  ? new Date(log.created_at).toLocaleString()
                                  : "Invalid Date"}
                          </td>
                          <td>{log.user_id || "System"}</td>
                          <td>{log.action}</td>
                          <td>{log.details}</td>
                          <td className={`status-${log.log_type.toLowerCase()}`}>
                              {log.log_type.toUpperCase()}
                          </td>
                      </tr>
                  ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default LogsComponent;
