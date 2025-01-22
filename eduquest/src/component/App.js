import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import { AuthProvider } from "../context/AuthContext";
import DashboardComponent from "./dashboard/DashboardComponent";
import UniversityComponent from "./dashboard/UniversityComponent";
import CompareComponent from "./compare/CompareComponent";
import ChatScreen from "./chats/Chats";
import ProtectedRoutes from "./ProtectedRoutes";
import { NotificationProvider } from "./notification/NotificationContext";
import './app.css'

function App() {
    const backgroundStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(150deg, red, #0072ff)',
        padding: '20px',
        boxSizing: 'border-box'
    };
    return (
        <NotificationProvider>
            <AuthProvider>
                <BrowserRouter>
                    <div style={backgroundStyle}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/university/:id" element={<UniversityComponent />} />
                            {/* Protected routes for the dashboard */}
                            <Route element={<ProtectedRoutes />}>
                                <Route path="/dashboard" element={<DashboardComponent />} />
                                <Route path="/dashboard/university/:id" element={<UniversityComponent />} />
                                <Route path="/dashboard/compare" element={<CompareComponent />} />
                                <Route path="/dashboard/chat" element={<ChatScreen />} />
                            </Route>
                            
                        </Routes>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </NotificationProvider>
    );
}

export default App;