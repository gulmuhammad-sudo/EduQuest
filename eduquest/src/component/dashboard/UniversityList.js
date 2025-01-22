import React from 'react';
import { Card } from 'react-bootstrap';
import './universityList.css';

function UniversityList({ universityList, onUniversitySelect }) {
    return (
        <div className="university-list">
            {universityList.map((university, index) => (
                <Card
                    key={index}
                    className="university-card"
                    onClick={() => onUniversitySelect(university)}
                >
                    <Card.Img variant="top" height={200} width={200} src={university.image} />
                    <Card.Body>
                        <Card.Title>{university.name}</Card.Title>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default UniversityList;
