import axios from "axios";

const client = axios.create({baseURL: "http://localhost:4000/users", withCredentials: true})

export const getAllUsers = () => {
    return client.get('/');
}

export const approveUser = (userId) => {
    return client.post('/approve', {userId});
}

export const rejectUser = (userId) => {
    return client.post('/reject', {userId});
}