import React, { useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import HeaderComponent from "../home/HeaderComponent";
import { useNavigate } from "react-router-dom";
import SearchUniversity from "./SearchUniversity";
import ShowComparison from "./ShowComparison";

function CompareComponent() {
  const navigate = useNavigate();
  const [selectedUniversity1, setSelectedUniversity1] = useState(null);
  const [selectedUniversity2, setSelectedUniversity2] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");  // Department filter state

  const handleCompare = () => {
    setShowComparison(true);
  };

  const onBackPressed = () => {
    setShowComparison(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="rounded p-4"
        style={{ width: "80%", minHeight: "60vh", borderRadius: "15px" }}
      >
        <Card.Body>
          <HeaderComponent />
          {!showComparison && (
            <SearchUniversity
              selectedUniversity1={selectedUniversity1}
              selectedUniversity2={selectedUniversity2}
              setSelectedUniversity1={setSelectedUniversity1}
              setSelectedUniversity2={setSelectedUniversity2}
              handleCompare={handleCompare}
            />
          )}

          {showComparison && (
            <ShowComparison
              selectedUniversity1={selectedUniversity1}
              selectedUniversity2={selectedUniversity2}
              selectedDepartment={selectedDepartment}  // Pass department filter
              setSelectedDepartment={setSelectedDepartment}  // Function to change department filter
              onBackPressed={onBackPressed}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default CompareComponent;
