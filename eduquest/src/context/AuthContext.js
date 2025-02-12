import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook for easy access to AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const client = axios.create({baseURL: "http://localhost:4000", withCredentials: true})

    useEffect(() => {
        setLoading(true)
        client.get('/users/user').then(res => {
            setCurrentUser(res.data.user)
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.post('/users/login', { email, password });
            setCurrentUser(response.data.user);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.post('/users/register', { name, email, password });
            setCurrentUser(response.data.user);
        } catch (err) {
           throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await client.get('/users/logout');
            setCurrentUser(null);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    if (loading){
        return <>
        Loading
        </>
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
