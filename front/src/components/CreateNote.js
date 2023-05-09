import { Button, InputLabel, TextField } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineSend } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateNoteMutation, useGetUsersByIdQuery } from '../app/apiSlice';
import "./CreateSwap.css";


function CreatNote() {
    const id2 = localStorage.getItem("IDUserLogin")
    const id = JSON.parse(localStorage.getItem('IDUserLogin'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!id2) {
            navigate("/")
        }
    }, [])

    const [createNote] = useCreateNoteMutation();
    const location = useLocation()
    const dateFrom = location.state


    const [crewcode, setCrewcode] = useState("")
    const [date, setDate] = useState()
    const [inicio, setInicio] = useState("")
    const [fin, setFin] = useState("")
    const [razon, setRazon] = useState("")
    
    const rank = localStorage.getItem('Rank');


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
        if (crewcode.length === 6) {
            createNote({ date, inicio, fin, razon, rank, crewcode, userId: id[0], requested: true, denied: false })
            setSwapDone(true)
        }


    }
    //console.log(id)
    //console.log(swapData.roster)
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
                                variant="outlined" endIcon={<AiOutlineCalendar />} className='buttonSubmitCreateSwap'>
                                Go to calendar
                            </Button>
                        </div>
                    </div>
                    :
                    <>
                        <div>
                            <h1>
                                <div className='splitCreateSwap'>
                                    Create note
                                    <Button
                                        onClick={() => navigate("/calendariopropio")}
                                        variant="outlined" endIcon={<AiOutlineCalendar />} 
                                        
                                        className='buttonSubmitCreateSwapNote'>
                                        Go to
                                    </Button>
                                </div>
                            </h1>
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
                                            error={crewcode.length !== 6 && crewcode.length !== 0 ? true : false}
                                            helperText={crewcode.length !== 6 && crewcode.length !== 0 ? "Crewcode has to be 6 letters" : ""}
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