import "./styles/globals.css";
import { useState } from "react";
import FileUpload from "./components/FileUpload";

function App() {
    const [files, setFiles] = useState([]);

    return (
        <div className="App">
            <FileUpload handleSetFiles={setFiles} maxNumFiles={75} maxFileSizeMB={30} />
        </div>
    );
}

export default App;
