import React, { useState } from "react";

const FlashCard = (props) => {
    const { id, question, answer } = props;
    const [status, setStatus] = useState(false);
    const handleOnClick = () => {
        setStatus(!status);
    };

    return (
        <>
            <div id={id} className="scene scene-card" onClick={handleOnClick}>
                <div className={`card ${status ? "flip" : ""}`}>
                    <div className="card-face card-face-front">
                        <span>{question}</span>
                    </div>
                    <div className="card-face card-face-back">
                        <span>{answer}</span>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FlashCard;
