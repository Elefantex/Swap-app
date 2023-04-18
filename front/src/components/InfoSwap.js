import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import Swap from "./Swap"


function InfoSwap() {
    
    const { cellDate } = useParams()
    return (
        <>
            <Swap info={cellDate}></Swap>
        </>
    )
}

export default InfoSwap