import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import HeaderComponent from "../home/HeaderComponent";
import { useParams } from "react-router-dom";
import { getUniversityById } from "../../database/University";

function UniversityComponent() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  console.log(id);
  useEffect(() => {
    getUniversityById(id).then((res) => {
      setUniversity(res.data);
    });
  }, []);

  if (!university) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Card
          className="rounded p-4"
          style={{ width: "50%", height: "80vh", borderRadius: "15px" }}
        >
          <Card.Body>
            <h3 className="text-center text-danger">University Not Found</h3>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="rounded p-4"
        style={{
          width: "80%",
          height: "",
          marginTop: "30px",
          marginBottom: "30px",
          borderRadius: "15px",
        }}
      >
        <Card.Body>
          <HeaderComponent />
          <hr></hr>
          <Row>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src={university.cover}
                alt="University Cover"
                className="img-fluid rounded"
              />
            </Col>
            {/* First Column - University Logo */}
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src={university.logo}
                alt="University Logo"
                className="img-fluid rounded"
              />
            </Col>

            {/* Second Column - University Details */}
            <Col
              md={12}
              style={{
                textAlign: "justify",
                textJustify: "inter-word",
                marginTop: "30px",
              }}
            >
              <h3 className="text-primary">{university.moto}</h3>
              <p>{university.about}</p>
              <Button
                variant="link"
                onClick={() =>
                  window.open(university.contact.website, "_blank")
                }
              >
                Visit the page to see more
              </Button>
              <p>
                <strong>Contact at:</strong>
              </p>
              {/* Phone Number(s) */}
              {university.contact.number.map((phone, index) => (
                <p key={index}>
                  <FaPhoneAlt className="me-2" /> {phone}
                </p>
              ))}
              {/* Email(s) */}
              {university.contact.email.map((email, index) => (
                <p key={index}>
                  <FaEnvelope className="me-2" /> {email}
                </p>
              ))}
            </Col>

            {/* Third Column - University Cover Image */}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UniversityComponent;
