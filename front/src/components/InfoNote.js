import React from 'react';
import { useParams } from "react-router-dom";
import Note from "./Note";


function InfoNote() {
    
    const { cellDate } = useParams()
    return (
        <>
            <Note info={cellDate}></Note>
        </>
    )
}

export default InfoNote