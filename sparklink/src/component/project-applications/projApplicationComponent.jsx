import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../../notificationContext";
import "./projApplicationComponent.css";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import Swal from "sweetalert2";

const ProjApplicationComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { notifyCount, updateNotifyCount } = useNotification();
  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAccept = async (proj_id, user_id) => {
    console.log(proj_id, user_id);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/accept", {
        proj_id,
        user_id,
      });

      if (response.status === 200 || response.status === 201) {
        // Update the state to reflect the accepted project

        fetchNotifications();
        Swal.fire({
          title: "Success",
          text: "Project application accepted successfully!",
          icon: "success",
          confirmButtonText: "Ok",
        });
        // setSuccessMessage("Project application accepted successfully!"); // Success message
        // setErrorMessage(""); // Clear any previous error message
      } else {
        Swal.fire({
          title: "Error",
          text: response.data,
          icon: "error",
          confirmButtonText: "Ok",
        });
        // setErrorMessage("Failed to accept project: " + response.data); // Error message
        // setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error accepting project:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
      setErrorMessage("Error accepting project: " + error.message); // Error message
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  const handleReject = async (proj_id, user_id) => {
    console.log(proj_id, user_id);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/reject", {
        proj_id,
        user_id,
      });

      if (response.status === 200 || response.status === 201) {
        fetchNotifications();
        Swal.fire({
          title: "Success",
          text: "Project application rejected successfully!",
          icon: "success",
          confirmButtonText: "Ok",
        });
        // setSuccessMessage("Project application rejected successfully!"); // Success message
        // setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage("Failed to reject project: " + response.data); // Error message
        Swal.fire({
          title: "Error",
          text: `"Failed to reject project: ", ${response.data}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      Swal.fire({
        title: "Error",
        text: `"Error rejecting project: ", ${error.message}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
      setErrorMessage("Error rejecting project: " + error.message); // Error message
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  const handleOkay = async (proj_id, user_id, code) => {
    console.log(proj_id, user_id, code);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/notify/okay", {
        proj_id,
        user_id,
        code,
      });

      if (response.status === 200 || response.status === 201) {
        fetchNotifications();
        // setSuccessMessage("notification update successfully"); // Success message
        // setErrorMessage(""); // Clear any previous error message
      } else {
        console.log("Failed to update the notification: " + response.data); // Error message
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error updating notification: " + error.message);
      // setErrorMessage("Error updating notification: " + error.message); // Error message
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      updateNotifyCount();
      const response = await axios.get("/notify");
      console.log("APP DATA>>>>>>>>", response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationMessage = ({
    code,
    user_id,
    user_name,
    proj_id,
    proj_name,
  }) => {
    switch (code) {
      case "BP":
        return (
          <span>
            You successfully created a new project: <b> {proj_name}</b>.
          </span>
        );
      case "BS":
        return (
          <span>
            <b>
              <a
                className="no-underline-link"
                href={`/profile?user_id=${user_id}`}
              >
                {user_name}
              </a>
            </b>{" "}
            has been assigned as the supervisor for your project{" "}
            <b> {proj_name}</b>.
          </span>
        );
      case "BT":
        return (
          <span>
            <b>
              <a
                className="no-underline-link"
                href={`/profile?user_id=${user_id}`}
              >
                {user_name}
              </a>
            </b>{" "}
            has been assigned as a student for your project <b> {proj_name}</b>.
          </span>
        );
      case "SP":
        return (
          <span>
            You successfully created a new project: <b> {proj_name}</b>.
          </span>
        );
      case "SV":
        return (
          <span>
            You have been assigned as the supervisor for the project{" "}
            <b>"{proj_name}"</b>.
          </span>
        );
      case "SS":
        return (
          <span>
            <b>
              <a
                className="no-underline-link"
                href={`/profile?user_id=${user_id}`}
              >
                {user_name}
              </a>
            </b>{" "}
            has been assigned as the supervisor for your project{" "}
            <b> {proj_name}</b>.
          </span>
        );
      case "SA":
        return (
          <span>
            <b>
              <a
                className="no-underline-link"
                href={`/profile?user_id=${user_id}`}
              >
                {user_name}
              </a>
            </b>{" "}
            has applied for the project <b> {proj_name}</b>.
          </span>
        );
      case "ST":
        return (
          <span>
            <b>
              <a
                className="no-underline-link"
                href={`/profile?user_id=${user_id}`}
              >
                {user_name}
              </a>
            </b>{" "}
            has been assigned as a student for your project <b> {proj_name}</b>.
          </span>
        );
      case "TS":
        return (
          <span>
            Your application for the project <b> {proj_name}</b> has been
            successfully submitted.
          </span>
        );
      case "TA":
        return (
          <span>
            Your application for the project <b> {proj_name}</b> has been
            accepted.
          </span>
        );
      case "TR":
        return (
          <span>
            You have been removed from the project <b> {proj_name}</b>.
          </span>
        );
      default:
        return <span>Unknown notification code: {code}</span>;
    }
  };

  return (
    <div className="container-fluid">
      <MenuComponent />
      <div className="row">
        <MasterComponent />
        <div className="col-1"></div>
        <div className="col-11">
          <div className="notification-page">
            <h1 className="section-heading display-4">Notifications</h1>
            <div className="notifications-section">
              {notifications.length === 0 ? (
                // Show message when there are no notifications
                <div className="no-notifications">
                  <p className="no-notifications-message">
                    No notifications available at the moment.
                  </p>
                </div>
              ) : (
                // Render the notifications list when notifications are present
                <div className="notifications-list">
                  {notifications.map((notification, index) => (
                    <div className="notification-card" key={index}>
                      <div className="notification-details">
                        <p className="notification-message">
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="notification-timestamp">
                          {new Date(notification.created_on).toLocaleString()}
                        </p>
                      </div>
                      {notification.code === "SA" && (
                        <div className="action-buttons">
                          <button
                            className="btn-accept"
                            onClick={() =>
                              handleAccept(
                                notification.proj_id,
                                notification.user_id
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() =>
                              handleReject(
                                notification.proj_id,
                                notification.user_id
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {notification.code !== "SA" && (
                        <div className="action-buttons">
                          <button
                            className="btn-accept"
                            onClick={() =>
                              handleOkay(
                                notification.proj_id,
                                notification.user_id,
                                notification.code
                              )
                            }
                          >
                            Okay
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="message">
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loading-overlay d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div
              className="spinner-border text-light"
              style={{ width: "5rem", height: "5rem" }}
              role="status"
            ></div>
            <div className="text-light mt-2">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjApplicationComponent;
