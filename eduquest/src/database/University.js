import axios from "axios";

const client = axios.create({baseURL: "http://localhost:4000/university", withCredentials: true})

export const getUniversities = () => {
    return client.get('/');
}

export const getUniversityById = (id) => {
    return client.get('/'+id);
}