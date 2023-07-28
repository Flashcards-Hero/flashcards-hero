import React, { useState } from "react";
import "./App.css";
import Upload from "../src/components/Upload";
import FlashCards from "./components/FlashCards";

function App() {
    const [resultTxt, setResultTxt] = useState(null);
    return (
        <>
            <Upload resultTxt={resultTxt} setResultTxt={setResultTxt} />
            <FlashCards resultTxt={resultTxt} />
        </>
    );
}

export default App;
