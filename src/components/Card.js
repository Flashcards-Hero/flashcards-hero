import React from "react";

const FlashCard = (props) => {
    const { id, question, answer, setFlip, status } = props;
    // const [flip, setFlip] = useState(false);
    const handleOnClick = () => {
        setFlip(!status);
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
