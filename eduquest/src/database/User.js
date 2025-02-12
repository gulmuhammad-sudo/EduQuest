import axios from "axios";

const client = axios.create({baseURL: "http://eduquest-4drc.onrender.com:8080/users", withCredentials: true})

export const getAllUsers = () => {
    return client.get('/');
}

export const approveUser = (userId) => {
    return client.post('/approve', {userId});
}

export const rejectUser = (userId) => {
    return client.post('/reject', {userId});
}
