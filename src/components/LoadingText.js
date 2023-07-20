import React, { memo } from "react";

import LoadingSpinner from "./LoadingSpinner";

function LoadingText(props) {
    return (
        <div className="text-gray-500 text-md flex flex-row justify-center items-center">
            <LoadingSpinner />
            {props.text && <div className="flex">{props.text}</div>}
        </div>
    );
}

export default memo(LoadingText);
