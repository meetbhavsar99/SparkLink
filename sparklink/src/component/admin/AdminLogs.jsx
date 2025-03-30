import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [logType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let endpoint = "/api/admin/admin-logs"; // Updated endpoint
      if (logType !== "all") {
        endpoint = `/api/admin/admin-logs/${logType}`; // Updated to match backend
      }
      const response = await axios.get(endpoint);
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError("Error loading logs");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>Admin Logs</h2>
      <div className="mb-3">
        <Button
          variant="primary"
          onClick={() => setLogType("all")}
          className="me-2"
        >
          All Logs
        </Button>
        <Button
          variant="secondary"
          onClick={() => setLogType("users")}
          className="me-2"
        >
          User Logs
        </Button>
        <Button
          variant="info"
          onClick={() => setLogType("actions")}
          className="me-2"
        >
          Action Logs
        </Button>
        <Button
          variant="danger"
          onClick={() => setLogType("errors")}
          className="me-2"
        >
          Error Logs
        </Button>
      </div>

      {loading && <Spinner animation="border" className="loading-spinner" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.type}</td>
                <td>{log.message}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminLogs;
