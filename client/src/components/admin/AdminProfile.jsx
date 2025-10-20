import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";

function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users and authors
  useEffect(() => {
    axios
      .get("http://localhost:3000/admin-api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError("Failed to fetch users"));
  }, []);

  // Handle account status toggle
  const toggleAccountStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      // Send the updated 'isBlocked' status
      await axios.put(
        `http://localhost:3000/admin-api/toggle-status/${userId}`,
        {
          isBlocked: newStatus,
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: newStatus } : user
        )
      );
    } catch (error) {
      setError("Failed to update account status");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Profile</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.isBlocked ? (
                  <span className="text-danger">Blocked</span>
                ) : (
                  <span className="text-success">Active</span>
                )}
              </td>

              <td>
                <Button
                  variant={user.isBlocked ? "success" : "danger"}
                  onClick={() => toggleAccountStatus(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminProfile;
