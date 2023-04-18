import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import Note from "./Note"


function InfoNote() {
    
    const { cellDate } = useParams()
    return (
        <>
            <Note info={cellDate}></Note>
        </>
    )
}

export default InfoNote