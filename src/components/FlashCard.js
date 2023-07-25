import React, {useState} from 'react'; 

const FlashCard = (props) =>{
    const {id, question, answer} = props;
    const [flip, setFlip] = useState(false);
    const handleOnClick = () =>{
        setFlip(!flip);
    }
    
    return(
        <>
            <div id={id} className="scene scene-card" onClick={handleOnClick}>
                <div className={`card ${flip? 'flip': ''}`}>
                    <div className="card-face card-face-front">
                        <span>{question}</span>
                    </div>
                    <div className="card-face card-face-back">{answer}</div>
                </div>
            </div>
        </>
    )
}
export default FlashCard;