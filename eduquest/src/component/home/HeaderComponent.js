import { Button, Col, Row, InputGroup, Form, Dropdown } from "react-bootstrap";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importing icons for search and user
import { useEffect, useState } from "react";
import { getUniversities } from "../../database/University";

import "./home.css";

const HeaderComponent = ({
  showAuth = true,
  isAdmin = false,
  onLoginPressed,
  onRegisterPressed,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout().then((res) => {
      navigate("/");
    });
  };

  const [selectedUniversity1, setSelectedUniversity1] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [universities, setUniversities] = useState([]);
  useEffect(() => {
    getUniversities().then((res) => {
      setUniversities(res.data);
    });
  }, []);

  const handleSelectUniversity1 = (university) => {
    console.log(university);
    navigate(`/dashboard/university/${university._id}`);
  };

  const filteredUniversities1 = universities.filter((university) =>
    university.name.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  return (
    <Row>
      {/* Top Section: Title and Buttons */}
      <Col
        md={12}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <h2 style={{ color: "#007bff" }}>EduQuest</h2>{" "}
          {/* EduQuest in blue */}
        </a>
        {showAuth && !currentUser && (
          <div>
            <Button
              variant="light"
              className="me-2 shadow"
              style={{ color: "#007bff", border: "1px solid #007bff" }} // White button with blue border
              onClick={onLoginPressed}
            >
              Login
            </Button>
            <Button
              variant="primary"
              className="shadow" // Blue button with shadow
              onClick={onRegisterPressed}
            >
              Register
            </Button>
          </div>
        )}

        {currentUser && (
          <div className="d-flex align-items-center">
            {/* Navigation Options */}
            {currentUser.role !== "admin" && (
              <div className="d-flex me-3">
                <Button
                  variant="link"
                  className="me-2 custom-button"
                  style={{
                    fontSize: "1rem",
                    color: "#007bff", // Soft blue text color
                    backgroundColor: "transparent", // Transparent background for a cleaner look
                    border: "none", // Remove border
                    fontWeight: "normal", // Normal font weight for a softer look
                    textDecoration: "none", // No underline by default
                    padding: "6px 12px", // Moderate padding
                    borderRadius: "25px", // Slightly rounded corners
                    transition: "all 0.3s ease", // Smooth transition for hover effect
                  }}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="link"
                  className="me-2 custom-button"
                  style={{
                    fontSize: "1rem",
                    color: "#007bff",
                    backgroundColor: "transparent",
                    border: "none",
                    fontWeight: "normal",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "25px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    navigate("/dashboard/compare");
                  }}
                >
                  Compare
                </Button>
                <Button
                  variant="link"
                  className="me-2 custom-button"
                  style={{
                    fontSize: "1rem",
                    color: "#007bff",
                    backgroundColor: "transparent",
                    border: "none",
                    fontWeight: "normal",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "25px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    navigate("/dashboard/chat");
                  }}
                >
                  Chat
                </Button>
              </div>
            )}

            {/* Search Bar */}
            <div className="search-container">
              {selectedUniversity1 ? (
                <div />
              ) : (
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search University"
                    value={searchTerm1}
                    onChange={(e) => setSearchTerm1(e.target.value)}
                  />
                </InputGroup>
              )}

              {/* Search results container */}
              {!selectedUniversity1 && searchTerm1 && (
                <div className="search-results mt-2">
                  {filteredUniversities1.length > 0 ? (
                    filteredUniversities1.map((university) => (
                      <Button
                        key={university.id}
                        variant="link"
                        onClick={() => handleSelectUniversity1(university)}
                        className="row d-block w-100 text-start"
                      >
                        {university.name}
                      </Button>
                    ))
                  ) : (
                    <div>No universities found</div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Picture Icon */}
            <Dropdown>
              <Dropdown.Toggle variant="link" id="profile-dropdown">
                <FaUserCircle size={30} />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                {(currentUser?.role?.toLowerCase() === "admin" ||
                  currentUser?.role?.toLowerCase() === "user") && (
                  <Dropdown.Item onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default HeaderComponent;
