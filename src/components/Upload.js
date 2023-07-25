import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import FlashCard from "./FlashCard";

const Upload = () => {
    const [jsonOutput, setJsonOutput] = useState("");
    const [resultTxt, setResultTxt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState("");
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handleConvert = async (file) => {
        const pdfData = new Uint8Array(await file.arrayBuffer());
        try {
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            let pdfText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                pdfText += pageText + " ";
            }
            const jsonObject = { content: pdfText };
            const jsonString = JSON.stringify(jsonObject, null, 2);
            //   console.log(jsonObject.content);
            setJsonOutput(jsonString);
        } catch (error) {
            alert("Error while processing the PDF file.");
            console.error(error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }
        handleConvert(file);
    };

    const handleTypeChange = (e) => {
        // const jsObject = JSON.parse(jsonOutput);
        // jsObject['type'] = e.target.value;
        // setJsonOutput(JSON.stringify(jsObject, null, 2));
        // console.log(jsObject.type);
        const jsObject = { type: e.target.value };
        setType(JSON.stringify(jsObject));
    };

    async function HandleGenerate(e) {
        // const text = JSON.parse(jsonOutput);
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/build", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonOutput,
            });
            const data = await response.json();
            if (response.status === 200) {
                try {
                    const response2 = await fetch("http://localhost:8080/ask", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: type,
                    });
                    const result = await response2.json();
                    if (response2.status !== 200) {
                        setResultTxt("error");
                        setIsLoading(false);
                    }
                    formatResponse(result.text, result.type);
                    // console.log(result.text);
                    setIsLoading(false);
                } catch (e) {
                    setIsLoading(false);
                    console.log(e);
                }
            }
            if (response.status !== 200) {
                setResultTxt("error");
                setIsLoading(false);
            }
            // setResultTxt(data.choices);
            console.log(data);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }

    const formatResponse = (res, type) => {
        const arr = res.split("\n\n");
        // console.log(arr);
        const object = [];
        for (let i = 0; i < arr.length; i++) {
            const qa = type === "td" ? arr[i].split(":") : arr[i].split("\n");
            console.log(qa);
            const pair = { question: qa[0], answer: qa[1] };
            object.push(pair);
        }
        setResultTxt(object);
        console.log(object);
    };

    const handleNextCard = () => {
        if (currentCardIndex < resultTxt.length - 1) {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex((prevIndex) => prevIndex - 1);
        }
    };
    return (
        <>
            <div className="row p-5 bg-blue-50">
                <div className="col-md-4">
                    <div className="ml-2 font-bold text-xl mb-2">Upload file</div>
                    <input className="ml-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" type="file" onChange={handleFileChange} accept="application/pdf,application/vnd.ms-excel" />
                </div>
                <div className="col-md-3">
                    <div className="font-bold text-xl mb-2">Range</div>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" id="range" type="text" placeholder="example: chapter 1-5" />
                </div>
                <div className="col-md-3">
                    <div className="font-bold text-xl mb-2">Question Type:</div>
                    <div className="flex items-center">
                        <input onChange={handleTypeChange} id="disabled-radio-2" type="radio" value="td" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label for="disabled-radio-2" className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                            Term-Definition
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input onChange={handleTypeChange} id="disabled-radio-2" type="radio" value="qa" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label for="disabled-radio-2" className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                            Question-Answer
                        </label>
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={HandleGenerate} disabled={isLoading}>
                    {isLoading && <div class="spinner-border spinner-border-sm text-light mr-3" role="status"></div>}
                    Generate
                </button>
            </div>
            {/* <div>
                <p>{jsonOutput}</p>
            </div> */}
            <br />
            <div className="font-bold text-xl mb-2 pl-5">Result:</div>
            {/* flash card ui */}
            {!resultTxt ? (
                <p>Generate your flashcards now!</p>
            ) : (
                <div className="flashcards">
                    <div className="offset-md-2 col-md-4">
                        <FlashCard id={currentCardIndex} question={resultTxt[currentCardIndex].question} answer={resultTxt[currentCardIndex].answer} />
                    </div>
                    <div className="flex justify-center">
                        <button onClick={handlePreviousCard} disabled={currentCardIndex === 0} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                            Previous
                        </button>
                        <button onClick={handleNextCard} disabled={currentCardIndex === resultTxt.length - 1} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                            Next
                        </button>
                    </div>
                </div>
            )}
            {resultTxt != null &&
                resultTxt.map((item, index) => (
                    <>
                        <div className="offset-md-2 col-md-4">
                            <FlashCard id={index} question={item.question} answer={item.answer} />
                        </div>
                    </>
                ))}
            {/* <div>
                {resultTxt}
            </div> */}
        </>
    );
};

export default Upload;
