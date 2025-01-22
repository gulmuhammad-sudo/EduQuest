import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { FaUsers, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers, approveUser, rejectUser } from "../../database/User";

function AdminPanel() {
  const [showManage, setShowManage] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    setUsers(
      res.data.users.filter(
        (user) => user.status === "pending" && user.role !== "admin"
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(); // Initial load of users
  }, []);

  const handleManageRegistration = () => {
    setShowManage(true);
  };

  const handleManageChats = () => {
    navigate("/dashboard/chat");
  };

  const handleApprove = (userId) => {
    approveUser(userId).then(() => {
      // Refresh the user list or remove the approved user from the list
      setUsers(users.filter((user) => user.id !== userId)); // Adjust accordingly
    });
    fetchUsers();
  };

  const handleReject = (userId) => {
    rejectUser(userId).then(() => {
      // Refresh the user list or remove the rejected user from the list
      setUsers(users.filter((user) => user.id !== userId)); // Adjust accordingly
    });
    fetchUsers();
  };

  const handleBack = () => {
    setShowManage(false);
  };

  return (
    <div
      style={{
        height: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Admin Dashboard</h1>
      {!showManage && (
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="primary"
              style={{
                width: "150px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
              onClick={handleManageRegistration}
            >
              <FaUsers size={50} />
            </Button>
            <div style={{ marginTop: "10px" }}>
              Manage Registration Requests
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="primary"
              style={{
                width: "150px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
              onClick={handleManageChats}
            >
              <FaComments size={50} />
            </Button>
            <div style={{ marginTop: "10px" }}>Manage Chats</div>
          </div>
        </div>
      )}

      {showManage && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          </div>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.date).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReject(user._id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;
