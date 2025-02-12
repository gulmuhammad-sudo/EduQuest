import {Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {FaSearch} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {getUniversities} from "../../database/University";


const SearchUniversity = ({selectedUniversity1, selectedUniversity2, setSelectedUniversity1, setSelectedUniversity2, handleCompare}) => {
    const [searchTerm1, setSearchTerm1] = useState('');
    const [searchTerm2, setSearchTerm2] = useState('');
    const [universities, setUniversities] = useState([])
    useEffect(() => {
        getUniversities().then(res => {
            setUniversities(res.data)
        })
    }, []);

    const isCompareEnabled = selectedUniversity1 && selectedUniversity2;

    // Filter universities based on search term
    const filteredUniversities1 = universities.filter((university) =>
        university.name.toLowerCase().includes(searchTerm1.toLowerCase())
    );

    const filteredUniversities2 = universities.filter((university) =>
        university.name.toLowerCase().includes(searchTerm2.toLowerCase())
    );


    const handleSelectUniversity1 = (university) => setSelectedUniversity1(university);
    const handleSelectUniversity2 = (university) => setSelectedUniversity2(university);


    const handleReset1 = () => {
        setSelectedUniversity1(null);
        setSearchTerm1('');
    };
    const handleReset2 = () => {
        setSelectedUniversity2(null);
        setSearchTerm2('');
    };

    return (<>

        <Row>
            {/* First University Column */}
            <Col md={6}>
                <Card className="mb-4">
                    <Card.Body>
                        <h5>University 1</h5>
                        {selectedUniversity1 ? (
                            <div>
                                <h6>{selectedUniversity1.name}</h6>
                                <Button variant="danger" onClick={handleReset1}>Reset</Button>
                            </div>
                        ) : (
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search University 1"
                                    value={searchTerm1}
                                    onChange={(e) => setSearchTerm1(e.target.value)}
                                />
                            </InputGroup>
                        )}

                        {!selectedUniversity1 && searchTerm1 && (
                            <div className="mt-2">
                                {filteredUniversities1.length > 0 ? (
                                    filteredUniversities1.map((university) => (
                                        <Button
                                            key={university.id}
                                            variant="link"
                                            onClick={() => handleSelectUniversity1(university)}
                                            className="d-block w-100 text-start"
                                        >
                                            {university.name}
                                        </Button>
                                    ))
                                ) : (
                                    <div>No universities found</div>
                                )}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>

            {/* Second University Column */}
            <Col md={6}>
                <Card className="mb-4">
                    <Card.Body>
                        <h5>University 2</h5>
                        {selectedUniversity2 ? (
                            <div>
                                <h6>{selectedUniversity2.name}</h6>
                                <Button variant="danger" onClick={handleReset2}>Reset</Button>
                            </div>
                        ) : (
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search University 2"
                                    value={searchTerm2}
                                    onChange={(e) => setSearchTerm2(e.target.value)}
                                />
                            </InputGroup>
                        )}

                        {!selectedUniversity2 && searchTerm2 && (
                            <div className="mt-2">
                                {filteredUniversities2.length > 0 ? (
                                    filteredUniversities2.map((university) => (
                                        <Button
                                            key={university.id}
                                            variant="link"
                                            onClick={() => handleSelectUniversity2(university)}
                                            className="d-block w-100 text-start"
                                        >
                                            {university.name}
                                        </Button>
                                    ))
                                ) : (
                                    <div>No universities found</div>
                                )}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        {/* Compare Button */}
        <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={handleCompare} disabled={!isCompareEnabled}>
                Compare
            </Button>
        </div>

    </>)
}

export default SearchUniversity;