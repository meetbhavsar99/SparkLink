import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import FooterComponent from '../footer/FooterComponent';
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
      const response = await axios.get(`/api/logs/filter?${queryParams.toString()}`);
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

    const response = await axios.get(`/api/download?${queryParams.toString()}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Error downloading logs:", error);
  }
};


  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <MenuComponent />
          <MasterComponent />
          <div className="container mt-4">
            <h1 className="mb-4 text-title">System Logs & Activity Tracking</h1>
  
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
                <button className="btn btn-search" onClick={fetchLogs}>
                  Search
                </button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-success w-100" onClick={handleDownload}>
                  ⬇ Download Logs
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
                  {logs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage).map(log => (
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
              {/* Pagination Controls */}
              <div className="pagination-container d-flex justify-content-center my-3">
                <button
                  className="btn btn-secondary mx-1"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="mx-2 align-self-center">Page {currentPage} of {Math.ceil(logs.length / logsPerPage)}</span>

                <button
                  className="btn btn-secondary mx-1"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(logs.length / logsPerPage)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
      </>
    );
  };

export default LogsComponent;
