import { Col } from "react-bootstrap";
import React from "react";

const ImagesComponent = ({ imageLeft, imageRight }) => {
    return (
        <Col md={6} className="d-flex flex-column align-items-end" style={{ position: 'relative' }}>
            <div
                className="d-flex w-100"
                style={{gap: '10px', position: 'relative'}}
            >
                {/* Left Portrait Image */}
                <img
                    src={imageLeft}
                    alt="Left Placeholder Image"
                    style={{
                        width: '50%',
                        height: '75%',
                        objectFit: 'cover',
                        marginTop: '150px',
                    }}
                />

                {/* Right Portrait Image */}
                <img
                    src={imageRight}
                    alt="Right Placeholder Image"
                    style={{
                        width: '50%',
                        height: '75%',
                        objectFit: 'cover',
                        marginTop: '20px',  // Right image slightly above
                    }}
                />
                
            </div>

            {/* Text Overlay */}

        </Col>
    );
}

export default ImagesComponent;
