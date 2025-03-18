import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./logs.css";

const LogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("/api/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);

    try {
      const response = await axios.get(`/api/logs/filter?action=${value}`);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching filtered logs:", error);
    }
  };

  const [selectedLogType, setSelectedLogType] = useState("all");

    const filteredLogs = logs.filter(log => {
        if (selectedLogType === "all") return true;
        return log.log_type === selectedLogType;
    });

  return (
    <div className="page-container">
      <div className="content-container">
        <MenuComponent />
        <MasterComponent />
        <div className="container mt-4">
          <h1 className="mb-4">System Logs & Activity Tracking</h1>

          <select onChange={(e) => setSelectedLogType(e.target.value)}>
            <option value="all">All Logs</option>
            <option value="user">User Logs</option>
            <option value="action">Action Logs</option>
            <option value="error">Error Logs</option>
        </select>

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
                {filteredLogs.map(log => (
                    <tr key={log.log_id}>
                        <td>
                        {log.created_at && Date.parse(log.created_at) 
                            ? new Date(log.created_at).toLocaleString()
                            : "Invalid Date"}
                        </td>

                        <td>{log.user_id || "System"}</td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                        <td>{log.log_type.toUpperCase()}</td>
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
