import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import "./AdminAnalytics.css";

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/api/analytics");
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load analytics data.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p className="loading">Loading analytics...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-container">
      <div className="content-container">
        <MenuComponent />
        <MasterComponent />
        <div className="analytics-container">
          <h1 className="text-primary">Admin Analytics & Reports</h1>
          
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{analyticsData.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p>{analyticsData.activeUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Inactive Users</h3>
              <p>{analyticsData.inactiveUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Projects Created</h3>
              <p>{analyticsData.totalProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Projects</h3>
              <p>{analyticsData.completedProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Ongoing Projects</h3>
              <p>{analyticsData.ongoingProjects}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
