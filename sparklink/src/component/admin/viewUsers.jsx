import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import edit_icon from "../../assets/edit_icon.png";
import delete_icon from "../../assets/delete_icon.png";
import "./viewUsers.css";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../footer/FooterComponent";


const roleMapping = {
  1: "Admin",
  2: "Business_Owner",
  3: "Supervisor",
  4: "Student",
};

const reverseRoleMapping = {
  Admin: "1",
  Business_Owner: "2",
  Supervisor: "3",
  Student: "4",
};

const ViewUserComponent = () => {
  const [allUsers, setAllUsers] = useState([]); // Original unfiltered list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]); // For bulk actions
  const navigate = useNavigate();


  // Fetch users from the backend API

  // Function to handle filtering by role
  const filterByRole = (roleName) => {
    setRole(roleName);
    if (roleName === "All") {
      setFilteredUsers(allUsers); // Show all users
    } else {
      setFilteredUsers(allUsers.filter((user) => user.roleName === roleName));
    }
    setSearchQuery("");
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users/allusers");
      const mappedUsers = response.data.map((user) => ({
        ...user,
        roleName: roleMapping[user.role], // Add a readable roleName
        is_active: user.is_active === "Y", // Convert to boolean
      }));

      console.log(mappedUsers);
      setAllUsers(mappedUsers.sort((a, b) => a.user_id - b.user_id)); // Store full user list
      setFilteredUsers(mappedUsers.sort((a, b) => a.user_id - b.user_id)); // Initialize filtered list as full list
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser({
      ...user,
      is_active: user.is_active === true, // Ensure boolean value
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (user) => {
    try {
      console.log("entered handle delete click");
      const response = await axios.delete(`/api/users/delete/${user.user_id}`);
  
      if (response.status === 200) {
        Swal.fire({ title: 'Success', text: 'User successfully deleted!', icon: 'success', confirmButtonText: 'Ok' });
  
        // ✅ Remove user from state
        setAllUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== user.user_id));
        setFilteredUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== user.user_id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({ title: 'Error', text: 'Failed to delete the user.', icon: 'error', confirmButtonText: 'Ok' });
      console.log(user.user_id);
    }
  };
  
  

  const handleSearch = (query) => {
    if (query === "") {
      if (role === "All") {
        setFilteredUsers(allUsers); // Show all users if no query and role is "All"
      } else {
        setFilteredUsers(allUsers.filter((user) => user.roleName === role)); // Filter by role if no query
      }
      return;
    }

    setFilteredUsers(
      allUsers.filter((user) =>
        // Check if the user matches the query
        (user.username.toLowerCase().startsWith(query.toLowerCase()) ||
        user.user_id.toString().startsWith(query) ||
        user.email.toLowerCase().startsWith(query.toLowerCase())) &&
        // Check role condition
        (role === "All" || user.roleName === role) // Show all if role is "All", otherwise filter by role
      )
      // .sort((a, b) => a.user_id - b.user_id) // Sort by user_id in ascending order if needed
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedUser = {
        ...selectedUser,
        role: reverseRoleMapping[selectedUser.roleName], // Convert roleName to role ID
        is_active: selectedUser.is_active ? "Y" : "N", // Convert boolean to "Y"/"N"
      };
      await axios.put(`/api/users/${selectedUser.user_id}`, updatedUser);
      setShowModal(false);
      Swal.fire({ title: 'Success', text: 'User updated successfully!', icon: 'success', confirmButtonText: 'Ok' });
      // Refresh user list
      const response = await axios.get("/api/users/allusers");
      const mappedUsers = response.data.map((user) => ({
        ...user,
        roleName: roleMapping[user.role],
        is_active: user.is_active === "Y", // Ensure boolean consistency
      }));
      setAllUsers(mappedUsers);
      setFilteredUsers(mappedUsers);

      console.log(response.data.message);
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: `Error updating user: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      Swal.fire("Warning", "No users selected for deletion.", "warning");
      return;
    }
  
    try {
      const response = await axios.post("/api/users/bulk-delete", { user_ids: selectedUsers });
  
      if (response.status === 200) {
        Swal.fire("Deleted!", "Selected users have been deleted.", "success");
  
        // ✅ Remove deleted users from state
        setAllUsers((prevUsers) => prevUsers.filter((u) => !selectedUsers.includes(u.user_id)));
        setFilteredUsers((prevUsers) => prevUsers.filter((u) => !selectedUsers.includes(u.user_id)));
  
        setSelectedUsers([]); // ✅ Clear selection after deletion
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      Swal.fire("Error", "Failed to delete users.", "error");
      console.log(selectedUser);
    }
  };
  
  
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User ID,Username,Name,Email,Role,Status"]
        .concat(
          allUsers.map((user) =>
            [
              user.user_id,
              user.username,
              user.name,
              user.email,
              user.roleName,
              user.is_active ? "Active" : "Inactive",
            ].join(",")
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (    <div className="page-container">
  <MenuComponent />
  <MasterComponent />
  <div className="content-container">
    <div className="container-fluid user-management-wrapper">
      <h1 className="user-title mb-4">User Management</h1>

      {/* Filter & Actions Row */}
                  <div className="row gy-3 flex-column flex-md-row align-items-start justify-content-between mb-4 actions-bar">
              {/* Role Filters */}
              <div className="col-md-auto filter-group d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                {["All", "Business_Owner", "Supervisor", "Student", "Admin"].map((r, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline-primary"
                    onClick={() => filterByRole(r)}
                  >
                    {r.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Search & Bulk Actions */}
              <div className="col-md-auto d-flex flex-wrap gap-2 justify-content-center justify-content-md-end search-actions-group pt-md-1">
              <input
                  className="form-control search-input"
                  placeholder="Search by ID, Name or Email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <button
                  className="button-user-delete"
                  onClick={handleBulkDelete}
                  disabled={selectedUsers.length === 0}
                >
                  Bulk Delete
                </button>
                <button className="button-user" onClick={handleExportCSV}>
                  Export CSV
                </button>
                <button className="button-user" onClick={() => navigate("/admin/logs")}>
                  View Logs
                </button>
              </div>
            </div>


      {/* User Table */}
      <div className="table-responsive user-table-wrapper">
        <table className="table table-bordered table-hover user-table">
          <thead className="table-dark">
            <tr>
              <th>Select</th>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedUsers((prev) =>
                          e.target.checked
                            ? [...prev, user.user_id]
                            : prev.filter((id) => id !== user.user_id)
                        )
                      }
                    />
                  </td>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roleName}</td>
                  <td>
                    <img
                      src={edit_icon}
                      className="edit_icon me-2"
                      onClick={() => handleEditClick(user)}
                      alt="Edit"
                      title="Edit User"
                    />
                    <img
                      src={delete_icon}
                      className="delete_icon"
                      onClick={() => handleDeleteClick(user)}
                      alt="Delete"
                      title="Delete User"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="custom-user-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body-scroll">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" value={selectedUser.username} disabled />
                </Form.Group>

                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={selectedUser.password}
                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  />
                  <Form.Check
                    type="checkbox"
                    label={showPassword ? "Hide Password" : "Show Password"}
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mt-2"
                  />
                </Form.Group>

                <Form.Group controlId="role" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={reverseRoleMapping[selectedUser.roleName]}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        roleName: roleMapping[e.target.value],
                      })
                    }
                  >
                    <option value="1">Admin</option>
                    <option value="2">Business Owner</option>
                    <option value="3">Supervisor</option>
                    <option value="4">Student</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    label={selectedUser.is_active ? "Active" : "Inactive"}
                    checked={selectedUser.is_active}
                    onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      )}

    </div>
  </div>
  <FooterComponent />
</div>

  );
};

export default ViewUserComponent;
