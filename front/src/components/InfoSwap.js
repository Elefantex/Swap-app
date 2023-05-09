import React from 'react';
import { useParams } from "react-router-dom";
import Swap from "./Swap";


function InfoSwap() {
    
    const { cellDate } = useParams()
    return (
        <>
            <Swap info={cellDate}></Swap>
        </>
    )
}

export default InfoSwap