import React from 'react';

const Upload = () =>{
    const handleFileChange = (e) =>{
        console.log(e);
    }

    return(
        <>
            <div className='row'>
                <div className='col-md-6'>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">Upload file</label>
                    <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input" type="file" onChange={handleFileChange}
                        accept="application/pdf,application/vnd.ms-excel"/>
                    <button
                        type="button"
                        class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    >
                        Process
                    </button>
                </div>
                <div className='col-md-6'>
                    <h3>Range</h3>
                    <div class="flex flex-col">
                    <label class="inline-flex items-center mt-3">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" /><span class="ml-2 text-gray-700">Chapter 1</span>
                    </label>

                    <label class="inline-flex items-center mt-3">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-red-600" /><span class="ml-2 text-gray-700">Chapter 2</span>
                    </label>

                    <label class="inline-flex items-center mt-3">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-orange-600" /><span class="ml-2 text-gray-700">Chapter 3</span>
                    </label>

                    <label class="inline-flex items-center mt-3">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-yellow-600" /><span class="ml-2 text-gray-700">Chapter 4</span>
                    </label>
                </div>
                </div>

            </div>
        </>
    )
}

export default Upload;