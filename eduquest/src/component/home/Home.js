import React, { useState } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ImagesComponent from "./ImagesComponent";
import HeaderComponent from "./HeaderComponent";
import TextLeftHolder from "./TextLeftHolder";
import LoginComponent from "../login/LoginComponent";
import RegisterComponent from "../register/RegisterComponent";

function Home() {
  const [showComponent, setShowComponent] = useState("home");

  const onRegisterClicked = () => {
    setShowComponent("register");
  };
  const onLoginClicked = () => {
    setShowComponent("login");
  };
  const onBackPress = () => {
    setShowComponent("home");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="rounded p-4"
        style={{ width: "90%", borderRadius: "15px" }}
      >
        <Card.Body>
          <HeaderComponent
            showAuth={showComponent === "home"}
            onLoginPressed={onLoginClicked}
            onRegisterPressed={onRegisterClicked}
          />
          <Row>
            <>
              {/* Left Side */}
              <TextLeftHolder />
            </>
            {/* Right Side */}
            <>
              {showComponent === "home" && (
                <ImagesComponent
                  imageLeft={
                    "https://media.istockphoto.com/id/1002859060/photo/all-on-the-journey-of-a-better-future.jpg?s=612x612&w=0&k=20&c=ZwFbrJjPrkL9lmhDoGUCeWVc3ea5CnIQlcwNqaHKiJk="
                  }
                  imageRight={
                    "https://img.freepik.com/free-photo/full-shot-students-learning-indoors_23-2149647131.jpg"
                  }
                />
              )}
              {showComponent === "login" && (
                <LoginComponent onRegisterPressed={onRegisterClicked} />
              )}

              {showComponent === "register" && (
                <RegisterComponent onLoginPressed={onLoginClicked} />
              )}
            </>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
