import React, {useEffect, useState} from 'react';
import {Card} from 'react-bootstrap';
import HeaderComponent from "../home/HeaderComponent";
import UniversityList from "./UniversityList";
import {useNavigate} from "react-router-dom";
import {getUniversities} from "../../database/University";
import {useAuth} from "../../context/AuthContext";
import AdminPanel from "./AdminPanel";

function DashboardComponent() {
    const navigate = useNavigate()
    const {currentUser} = useAuth()
    const [universities, setUniversities] = useState([])
    const isAdmin = currentUser.role === "admin"

    useEffect(() => {
        getUniversities().then(res => {
            setUniversities(res.data)
        })
    }, []);

    const onUniversityClicked = (university) => {
        navigate("/dashboard/university/" + university._id)
    }
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="rounded p-4" style={{width: '80%', height: '80%', borderRadius: '15px'}}>
                <Card.Body>
                    <HeaderComponent/>
                    {isAdmin && <AdminPanel/>}
                    {!isAdmin &&
                        <UniversityList universityList={universities} onUniversitySelect={onUniversityClicked}/>}
                </Card.Body>
            </Card>
        </div>
    );
}

export default DashboardComponent;
