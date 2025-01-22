import React, { useState } from 'react';
import { Button, Card, Form, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../notification/NotificationContext";

function LoginComponent({ onRegisterPressed }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const { login, loading } = useAuth(); // Use login from useAuth
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const notify = useNotification();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            setValidated(true);
        } else {
            try {
                await login(email, password); // Call login function from useAuth
                console.log("Updating notification")
                notify('Login successful! Redirecting...');
            } catch (err) {
                console.error('Login error:', err);
                setError(err.msg || "Incorrect username/password");
            }
        }
    };

    return (
        <Col md={6}>
            <Card.Title className="text-center">Login</Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please Enter a valid email.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please Enter a password.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

                <div className="mt-3 text-center">
                    <span>Don't have an account? </span>
                    <Button variant="link" onClick={onRegisterPressed}>
                        Register
                    </Button>
                </div>
            </Form>
        </Col>
    );
}

export default LoginComponent;
