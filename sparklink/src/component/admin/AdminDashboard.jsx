import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [logsRes, projectsRes, usersRes, notificationsRes, analyticsRes] =
          await Promise.all([
            axios.get("/api/admin/logs"),
            axios.get("/api/admin/projects"),
            axios.get("/api/admin/users-summary"),
            axios.get("/api/admin/notifications"),
            axios.get("/api/admin/analytics"),
          ]);

        setLogs(logsRes.data);
        setProjects(projectsRes.data);
        setUserStats(usersRes.data);
        setNotifications(notificationsRes.data);
        setAnalytics(analyticsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <Spinner animation="border" className="loading-spinner" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="admin-dashboard">
      <MenuComponent />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Admin Dashboard</h1>

        {/* User Management Overview */}
        <Card className="mb-4">
          <Card.Header className="card-header">User Management</Card.Header>
          <Card.Body>
            <div className="user-stats">
              <p>Total Users: {userStats.totalUsers}</p>
              <p>Students: {userStats.students}</p>
              <p>Supervisors: {userStats.supervisors}</p>
              <p>Business Owners: {userStats.businessOwners}</p>
              <p>Admins: {userStats.admins}</p>
            </div>
            <p>
              Recently Registered Users: {userStats.recentUsers} (last 7 days)
            </p>
            <p>Pending Confirmations: {userStats.pendingConfirmations}</p>
          </Card.Body>
        </Card>

        {/* Project Management Section */}
        <Card className="mb-4">
          <Card.Header className="card-header">Project Management</Card.Header>
          <Card.Body>
            <Table bordered>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Progress (%)</th>
                  <th>Students</th>
                  <th>Supervisors</th>
                  <th>Business Owner</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.progress}%</td>
                    <td>{project.students.join(", ")}</td>
                    <td>{project.supervisors.join(", ")}</td>
                    <td>{project.businessOwner}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Logs & Activity Tracking */}
        <Card className="mb-4">
          <Card.Header className="card-header">System Logs</Card.Header>
          <Card.Body>
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
          </Card.Body>
        </Card>

        {/* Notifications & Alerts */}
        <Card className="mb-4">
          <Card.Header className="card-header">Notifications</Card.Header>
          <Card.Body>
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>{notification.message}</li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        {/* Performance & Analytics */}
        <Card className="mb-4">
          <Card.Header className="card-header">
            Performance & Analytics
          </Card.Header>
          <Card.Body>
            <p>Active Users: {analytics.activeUsers}</p>
            <p>Inactive Users: {analytics.inactiveUsers}</p>
            <p>Total Projects: {analytics.totalProjects}</p>
            <p>System Load: {analytics.systemLoad} requests</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
