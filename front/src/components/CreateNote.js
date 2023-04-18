import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import { useCreateNoteMutation, useCreateSwapMutation, useGetUsersByIdQuery } from '../app/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import "./CreateSwap.css"
import { useLocation } from 'react-router-dom'
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle, FormHelperText } from "@mui/material";
import { AiOutlineSend, AiOutlineCalendar } from "react-icons/ai"


function CreatNote() {
    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])

    const [createNote] = useCreateNoteMutation();
    const navigate = useNavigate();
    const location = useLocation()
    const dateFrom = location.state


    const [crewcode, setCrewcode] = useState("")
    const [date, setDate] = useState()
    const [inicio, setInicio] = useState("")
    const [fin, setFin] = useState("")
    const [razon, setRazon] = useState("")
    const [tipoSwap, setTipoSwap] = useState("")
    const rank = localStorage.getItem('Rank');
    const id = JSON.parse(localStorage.getItem('IDUserLogin'));
   

    useEffect(() => {
        if (dateFrom !== null) {
            setDate(dateFrom.dateFrom)
        }
    }, [])

    const { data: swapData = [] } = useGetUsersByIdQuery(id)
    const [swapDone, setSwapDone] = useState(false)
    const handleInputChange = (event) => {
        const value = event.target.value.replace(/[^A-Za-z]/g, ""); // remove non-letter characters
        setCrewcode(value.toUpperCase()); // convert to uppercase
    };


    const submitForm = (e) => {
        e.preventDefault();
        createNote({ date, inicio, fin, razon, rank, crewcode, userId: id[0], requested: true, denied: false })
        setSwapDone(true)
    }
    console.log(id)
    console.log(swapData.roster)
    return (<>
        <div className='todoCreateSwapCaja'>
            <div className='datos'>

                {swapDone === true
                    ? <div>
                        <h2>
                            Note created
                        </h2>
                        <div>
                            <Button
                                onClick={() => navigate("/calendariopropio")}
                                variant="outlined" type="submit" endIcon={<AiOutlineCalendar />} className='buttonSubmitCreateSwap'>
                                Go to calendar
                            </Button>
                        </div>
                    </div>
                    :
                    <>
                        <div>
                            <h1>{tipoSwap ? <div>{tipoSwap}</div> : <div>Create note</div>}</h1>
                            <form onSubmit={submitForm} className='swapform'>
                                <div>
                                    <InputLabel >Date:</InputLabel>
                                    <div>
                                        <TextField id="outlined-basic" variant="outlined"
                                            type="date"
                                            value={date}
                                            placeholder=""
                                            onChange={e => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel >Starting hour:</InputLabel>
                                    <div>
                                        <TextField id="outlined-basic" variant="outlined"
                                            type="time"
                                            value={inicio}
                                            placeholder=""
                                            onInput={e => setInicio(e.target.value)} required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel >Finish hour:</InputLabel>
                                    <div>
                                        <TextField id="outlined-basic" variant="outlined"
                                            type="time"
                                            value={fin}
                                            placeholder=""
                                            onInput={e => setFin(e.target.value)} required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel >Crewcode:</InputLabel>
                                    <div>
                                        <TextField id="outlined-basic" variant="outlined"
                                            inputProps={{ maxLength: 6, minLength: 6 }}
                                            type="text"
                                            value={crewcode}
                                            placeholder="Crewcode"
                                            onChange={handleInputChange}
                                            maxLength="6"
                                            minLength="6"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel >Info extra</InputLabel>
                                    <div>
                                        <textarea name="" id="" cols="40" rows="5" maxLength="256" value={razon} onInput={e => setRazon(e.target.value)}
                                            placeholder='Info about it'>
                                        </textarea>
                                        <div>
                                            Max characters: {razon.length} / 256
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outlined" type="submit" endIcon={<AiOutlineSend />} className='buttonSubmitCreateSwap'>
                                        Submit</Button>
                                </div>

                            </form>

                        </div>

                    </>
                }

            </div>

        </div>


    </>)
}
export default CreatNote