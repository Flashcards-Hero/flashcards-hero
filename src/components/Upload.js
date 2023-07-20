import React from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const Upload = ({ jsonOutput, setJsonOutput }) => {
    // const [jsonOutput, setJsonOutput] = useState("");
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

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">
                        Upload file
                    </label>
                    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={handleFileChange} accept="application/pdf,application/vnd.ms-excel" />
                </div>
                <div className="col-md-6">
                    <h3>Range</h3>
                    <div class="flex flex-col">
                        <label class="inline-flex items-center mt-3">
                            <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" />
                            <span class="ml-2 text-gray-700">Chapter 1</span>
                        </label>

                        <label class="inline-flex items-center mt-3">
                            <input type="checkbox" class="form-checkbox h-5 w-5 text-red-600" />
                            <span class="ml-2 text-gray-700">Chapter 2</span>
                        </label>

                        <label class="inline-flex items-center mt-3">
                            <input type="checkbox" class="form-checkbox h-5 w-5 text-orange-600" />
                            <span class="ml-2 text-gray-700">Chapter 3</span>
                        </label>

                        <label class="inline-flex items-center mt-3">
                            <input type="checkbox" class="form-checkbox h-5 w-5 text-yellow-600" />
                            <span class="ml-2 text-gray-700">Chapter 4</span>
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <p>{jsonOutput}</p>
            </div>
        </>
    );
};

export default Upload;
