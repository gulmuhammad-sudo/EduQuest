import { Button, Card, Col, Row, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";

const ShowComparison = ({ selectedUniversity1, selectedUniversity2, onBackPressed }) => {
    const [showFullDescription1, setShowFullDescription1] = useState(false);
    const [showFullDescription2, setShowFullDescription2] = useState(false);

    useEffect(() => {
        // Log the university data to the console
    }, [selectedUniversity1, selectedUniversity2]);

    const allCourses = Array.from(
        new Set([...Object.keys(selectedUniversity1.feeStructure), ...Object.keys(selectedUniversity2.feeStructure)])
    );

    const renderTable = (feeStructure) => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {feeStructure && feeStructure.length > 0 &&
                            Object.keys(feeStructure[0]).map((key, index) => (
                                <th key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {feeStructure && feeStructure.map((fee, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(fee).map((value, colIndex) => (
                                <td key={colIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderDescription = (description, showFull, toggleShowFull) => {
        const shortDescription = description.slice(0, 300); // First 300 characters
        return (
            <>
                {showFull ? description : `${shortDescription}...`}
                <Button
                    variant="link"
                    onClick={toggleShowFull}
                    style={{ padding: 0, marginLeft: '5px' }}
                >
                    {showFull ? "See Less" : "See More"}
                </Button>
            </>
        );
    };

    const [searchTerm1, setSearchTerm1] = useState("");
    const [searchTerm2, setSearchTerm2] = useState("");

    const filterTable = (tableData, searchTerm) => {
        if (!searchTerm) return tableData;
        return tableData.filter(row =>
            Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    return (
        <>
            <Button variant="primary" onClick={onBackPressed} className="mb-4">
                Back
            </Button>
            <Row>
                <Col>
                    <h3>University Comparison</h3>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="mb-4 h-100">
                        <Card.Img variant="top" src={selectedUniversity1.cover} style={{ height: "200px", objectFit: "cover" }} />
                        <Card.Body className="d-flex flex-column">
                            <Card.Title className="d-flex align-items-center">
                                <img src={selectedUniversity1.logo} alt="logo" style={{ width: "50px", marginRight: "10px" }} />
                                {selectedUniversity1.name}
                            </Card.Title>
                            <Card.Text className="flex-grow-1">
                                {renderDescription(
                                    selectedUniversity1.about,
                                    showFullDescription1,
                                    () => setShowFullDescription1(!showFullDescription1)
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4 h-100">
                        <Card.Img variant="top" src={selectedUniversity2.cover} style={{ height: "200px", objectFit: "cover" }} />
                        <Card.Body className="d-flex flex-column">
                            <Card.Title className="d-flex align-items-center">
                                <img src={selectedUniversity2.logo} alt="logo" style={{ width: "50px", marginRight: "10px" }} />
                                {selectedUniversity2.name}
                            </Card.Title>
                            <Card.Text className="flex-grow-1">
                                {renderDescription(
                                    selectedUniversity2.about,
                                    showFullDescription2,
                                    () => setShowFullDescription2(!showFullDescription2)
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: "30px" }}>
                <Col md={6} style={{ marginTop: "30px" }}>
                    <h4>{selectedUniversity1.name}</h4>
                    <input
                        type="text"
                        placeholder="Search table..."
                        value={searchTerm1}
                        onChange={(e) => setSearchTerm1(e.target.value)}
                        className="form-control mb-3"
                    />
                    {renderTable(filterTable(selectedUniversity1.feeStructure, searchTerm1))}
                </Col>
                <Col md={6} style={{ marginTop: "30px" }}>
                    <h4>{selectedUniversity2.name}</h4>                    <input
                        type="text"
                        placeholder="Search table..."
                        value={searchTerm2}
                        onChange={(e) => setSearchTerm2(e.target.value)}
                        className="form-control mb-3"
                    />
                    {renderTable(filterTable(selectedUniversity2.feeStructure, searchTerm2))}
                </Col>
            </Row>
        </>
    );
};

export default ShowComparison;
