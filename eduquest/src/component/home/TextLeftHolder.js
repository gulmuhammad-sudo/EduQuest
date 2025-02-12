import { Button, Col, Form, InputGroup } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import { getUniversities } from "../../database/University";
import { useNavigate } from "react-router-dom"; // Importing icons for search and user
import { FaSearch, FaUserCircle } from "react-icons/fa";

import "./home.css";

const TextLeftHolder = () => {
  const navigate = useNavigate();
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
    navigate(`/university/${university._id}`);
  };

  const filteredUniversities1 = universities.filter((university) =>
    university.name.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  return (
    <Col md={6} style={{ marginTop: "8%" }}>
      <h4 style={{ color: "#001f3f", fontSize: "2rem", lineHeight: "1.2" }}>
        Your Central Gateway to <br /> University Insights
      </h4>{" "}
      {/* Navy blue, multiline heading */}
      <p>
        Welcome to EduQuest. Your central gateway to university insights!
        Discover comprehensive details on programs, universities, and
        scholarships all in one place. Start exploring today and find your
        perfect university match.
      </p>
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
              placeholder="Find what you're looking for"
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              style={{
                backgroundColor: "white",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                borderRight: "100px",
              }}
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
                  className="row d-block w-100 text-start">
                  {university.name}
                </Button>
              ))
            ) : (
              <div>No universities found</div>
            )}
          </div>
        )}
      </div>
      <div className="align-content-center">
        <div
          className="text-center bg-primary text-white p-2"
          style={{
            position: "relative",
            borderRadius: "10px",
            fontSize: "",
            width: "70%",
            margin: "auto",
            marginTop: "35px",
          }}
        >
          <p>✓ Find Universities with Ease</p>
          <p>✓ Universities Comparison</p>
        </div>
      </div>
    </Col>
  );
};

export default TextLeftHolder;
