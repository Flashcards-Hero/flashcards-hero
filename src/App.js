import React, { useState } from "react";
import "./App.css";
import Upload from "../src/components/Upload";

function App() {
    const [jsonOutput, setJsonOutput] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        console.log(jsonOutput);
        try {
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonOutput,
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }
            setResult(data.result);
            console.log(result);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }
    return (
        <>
            <Upload jsonOutput={jsonOutput} setJsonOutput={setJsonOutput} />
            <button onClick={onSubmit}>Generate</button>
        </>
    );
}

export default App;
