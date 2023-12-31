import React, {useState} from 'react';
import * as pdfjsLib from "pdfjs-dist/webpack";
import FlashCard from './FlashCard';


const Upload = () =>{
    const [jsonOutput, setJsonOutput] = useState("");
    const [resultTxt, setResultTxt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('');
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

    const handleTypeChange = (e) =>{
        // const jsObject = JSON.parse(jsonOutput);
        // jsObject['type'] = e.target.value;
        // setJsonOutput(JSON.stringify(jsObject, null, 2));
        // console.log(jsObject.type);
        const jsObject = {type: e.target.value};
        setType(JSON.stringify(jsObject));
    }

    async function HandleGenerate(e){
        // const text = JSON.parse(jsonOutput);
        setIsLoading(true);
        try{
            const response = await fetch('http://localhost:8080/build',{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: jsonOutput
            })
            const data = await response.json();
            if(response.status==200){
                try{
                    const response2 = await fetch('http://localhost:8080/ask',{
                        method: "POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: type
                    })
                    const result = await response2.json();
                    if(response2.status!=200){
                        setResultTxt("error");
                        setIsLoading(false);
                    }
                    setResultTxt(result.text);
                    // console.log(result.text);
                    setIsLoading(false);
                }catch(e){
                    console.log(e);
                }
            }
            if(response.status!=200){
                setResultTxt("error");
                setIsLoading(false);
            }
            // setResultTxt(data.choices);
            console.log(data);
        }catch(e){
            console.log(e);
        }
    }

    return(
        <>
            <div className='row'>
                <div className='col-md-3'>
                    <div className="ml-2 font-bold text-xl mb-2">Upload file</div>
                    <input className="ml-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        type="file" onChange={handleFileChange}
                        accept="application/pdf,application/vnd.ms-excel"/>
                </div>
                <div className='col-md-3'>
                    <div className="font-bold text-xl mb-2">Range</div>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" id="range" type="text" placeholder="example: chapter 1-5"/>
                    {/* <div className="flex flex-col">
                    <label className="inline-flex items-center mt-3">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" /><span className="ml-2 text-gray-700">Chapter 1</span>
                    </label>

                    <label className="inline-flex items-center mt-3">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-red-600" /><span className="ml-2 text-gray-700">Chapter 2</span>
                    </label>

                    <label className="inline-flex items-center mt-3">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-orange-600" /><span className="ml-2 text-gray-700">Chapter 3</span>
                    </label>

                    <label className="inline-flex items-center mt-3">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-yellow-600" /><span className="ml-2 text-gray-700">Chapter 4</span>
                    </label> */}
                </div>
                <div className='col-md-3'>
                <div className="font-bold text-xl mb-2">Question Type:</div>
                    <div className="flex items-center">
                        <input onChange={handleTypeChange} id="disabled-radio-2" type="radio" value="td" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="disabled-radio-2" className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">Term-Definition</label>
                    </div>
                    <div className="flex items-center">
                        <input onChange={handleTypeChange} id="disabled-radio-2" type="radio" value="qa" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="disabled-radio-2" className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">Question-Answer</label>
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={HandleGenerate} disabled={isLoading}>
                    Generate
                </button>
            

            </div>
            {/* <div>
                <p>{jsonOutput}</p>
            </div> */}
            <br/>
            <div className="font-bold text-xl mb-2">Result:</div>
            {/* flash card ui */}
            {/* {resultTxt!=null && resultTxt.map((item, index)=>(
                <>
                    <div className='offset-md-2 col-md-6'>
                        <FlashCard id={index} question={item.message.content} answer="123"/>
                    </div>
                </>
            ))} */}
            <div>
                {resultTxt}
            </div>
        </>
    )
}

export default Upload;