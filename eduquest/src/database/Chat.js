import axios from "axios";

const client = axios.create({baseURL: "http://eduquest-4drc.onrender.com:8080/chat", withCredentials: true})

export const getChats = () => {
    return client.get('/');
}

// database/Chat.js
export const sendMessage = (formData) => {
    return client.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};


  
export const deleteMessage = (messageId) => {
    return client.delete('/', { params: { messageId } });
}
