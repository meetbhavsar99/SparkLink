import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import "./AdminSystemSettings.css";

const AdminSystemSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: false,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch current settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/admin/settings");
        setSettings(response.data);
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  // Save settings to backend
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage("");

    try {
      await axios.put("/api/admin/settings", settings);
      setSuccessMessage("Settings updated successfully!");
    } catch (err) {
      setError("Failed to save settings. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <MenuComponent />
      <div className="container mt-4">
        <h2 className="text-center mb-4">System Settings</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <div className="settings-card">
          <Form>
            {/* Email Notifications */}
            <Form.Group className="mb-3">
              <Form.Label>Email Notifications</Form.Label>
              <div className="toggle-switch">
                <Form.Check
                  type="switch"
                  id="email-notifications"
                  label={settings.emailNotifications ? "Enabled" : "Disabled"}
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            {/* Maintenance Mode */}
            <Form.Group className="mb-3">
              <Form.Label>Maintenance Mode</Form.Label>
              <div className="toggle-switch">
                <Form.Check
                  type="switch"
                  id="maintenance-mode"
                  label={settings.maintenanceMode ? "Enabled" : "Disabled"}
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="save-btn"
            >
              {saving ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AdminSystemSettings;
