import React, { useState } from 'react';
import { Button, Form, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import { useNotification } from '../notification/NotificationContext';

function RegisterComponent({ onLoginPressed }) {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const { register, loading, error } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const notify = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            notify("Passwords do not match!");
            return;
        }

        // Call the register function from useAuth
        try {
            const result = await register(formData.name, formData.email, formData.password);
            notify('Registration successful! Redirecting to login...');
            setTimeout(() => {
                onLoginPressed(); // Redirect to login
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    return (
        <Col md={6}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please Enter a password.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please confirm your password.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </Button>

                <div className="mt-3 text-center">
                    <span>Already have an account? </span>
                    <Button variant="link" onClick={onLoginPressed}>
                        Login
                    </Button>
                </div>
            </Form>
        </Col>
    );
}

export default RegisterComponent;
