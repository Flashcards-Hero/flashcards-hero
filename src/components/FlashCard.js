import React, {useState} from 'react'; 

const FlashCard = (props) =>{
    const {id, question, answer} = props;
    
    return(
        <>
            <div id={id} class="scene scene-card">
                <div class="card">
                    <div class="card-face card-face-front">
                        <span>{question}</span>
                    </div>
                    <div class="card-face card-face-back">{answer}</div>
                </div>
            </div>
        </>
    )
}
export default FlashCard;