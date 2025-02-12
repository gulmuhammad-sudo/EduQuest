import axios from "axios";

const client = axios.create({baseURL: "http://eduquest-4drc.onrender.com:8080/university", withCredentials: true})

export const getUniversities = () => {
    return client.get('/');
}

export const getUniversityById = (id) => {
    return client.get('/'+id);
}
