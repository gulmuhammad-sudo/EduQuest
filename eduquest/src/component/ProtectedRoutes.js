import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoutes = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
