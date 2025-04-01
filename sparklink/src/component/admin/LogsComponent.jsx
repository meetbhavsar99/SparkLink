import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from "../footer/FooterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./logs.css";

const LogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLogType, setSelectedLogType] = useState("all");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAction, setSearchAction] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

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
      const response = await axios.get(
        `/api/logs/filter?${queryParams.toString()}`
      );
      setLogs(response.data);
      setCurrentPage(1); // Reset to first page on new search/filter
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({
        log_type: selectedLogType !== "all" ? selectedLogType : "",
        user_id: searchUserId,
        date: searchDate,
        action: searchAction,
      });

      const response = await axios.get(
        `/api/download?${queryParams.toString()}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "filtered_logs.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading logs:", error);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <MenuComponent />
          <MasterComponent />
          <div className="logs-wrapper">
            <div className="log-content">
              <h1 className="logs-title">System Logs & Activity Tracking</h1>
            </div>

            {/* Filter Section */}
            <div className="logs-filters">
              <input
                type="text"
                placeholder="Search by User ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
              />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Search by Action"
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
              />
              <button onClick={fetchLogs}>Search</button>
              <button className="button" onClick={handleDownload}>
                Download Logs
              </button>
            </div>

            {/* Log Type Dropdown */}
            <select
              className="logs-select"
              onChange={(e) => setSelectedLogType(e.target.value)}
            >
              <option value="all">All Logs</option>
              <option value="user">User Logs</option>
              <option value="action">Action Logs</option>
              <option value="error">Error Logs</option>
            </select>

            {/* Logs Table */}
            <div className="logs-table-wrapper">
              <table className="logs-table">
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
                  {logs
                    .slice(
                      (currentPage - 1) * logsPerPage,
                      currentPage * logsPerPage
                    )
                    .map((log) => (
                      <tr key={log.log_id}>
                        <td>
                          {log.created_at && Date.parse(log.created_at)
                            ? new Date(log.created_at).toLocaleString()
                            : "Invalid Date"}
                        </td>
                        <td>{log.user_id || "System"}</td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                        <td
                          className={`log-status log-status-${log.log_type.toLowerCase()}`}
                        >
                          {log.log_type.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="logs-pagination">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="log-page-text">
                Page {currentPage} of {Math.ceil(logs.length / logsPerPage)}
              </span>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(logs.length / logsPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default LogsComponent;
