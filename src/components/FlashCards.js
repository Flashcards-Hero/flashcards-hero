import React, { useState } from "react";
import Card from "./Card";

function FlashCards({ resultTxt }) {
    const [flip, setFlip] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handleNextCard = () => {
        if (currentCardIndex < resultTxt.length - 1) {
            setFlip(false);
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setFlip(false);
            setCurrentCardIndex((prevIndex) => prevIndex - 1);
        }
    };
    return (
        <div>
            <br />
            <div className="font-bold text-xl mb-2 pl-5">Result:</div>
            {/* flash card slider ui */}
            {!resultTxt ? (
                <div className="flex justify-center items-center">
                    <p className="text-lg">Generate your flashcards now!</p>
                </div>
            ) : (
                <div className="flashcards">
                    <div className="offset-md-2 col-md-4">
                        <Card id={currentCardIndex} question={resultTxt[currentCardIndex].question} answer={resultTxt[currentCardIndex].answer} setFlip={setFlip} status={flip} />
                    </div>
                    <div className="row next-pre-button-group flex z-50 mb-5 offset-md-3">
                        <button onClick={handlePreviousCard} disabled={currentCardIndex === 0} className="col-sm-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-10">
                            Previous
                        </button>
                        <button onClick={handleNextCard} disabled={currentCardIndex === resultTxt.length - 1} className="col-sm-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-20">
                            Next
                        </button>
                    </div>
                </div>
            )}
            {/* flash card vertical ui */}
            {resultTxt != null &&
                resultTxt.map((item, index) => (
                    <>
                        <div className="offset-md-2">
                            <Card id={index} question={item.question} answer={item.answer} />
                        </div>
                    </>
                ))}
        </div>
    );
}

export default FlashCards;
