import { Button, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineSend } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateSwapMutation, useGetUsersByIdQuery } from '../app/apiSlice';
import "./CreateSwap.css";



function CreateSwap() {

  const [createSwap] = useCreateSwapMutation();
  const navigate = useNavigate();

  const [date, setDate] = useState()
  const [inicio, setInicio] = useState("")
  const [fin, setFin] = useState("")
  const [razon, setRazon] = useState("")
  const [tipoSwap, setTipoSwap] = useState("")
  const rank = localStorage.getItem('Rank');
  const id = JSON.parse(localStorage.getItem('IDUserLogin'));
  const location = useLocation()

  const dateFrom = location.state

  useEffect(() => {
    if (!id) {
      navigate("/")
    }
  }, [])
  useEffect(() => {
    if (dateFrom !== null) {
      setDate(dateFrom.dateFrom)
    }
  }, [])

  const { data: swapData = [] } = useGetUsersByIdQuery(id)
  const [swapDone, setSwapDone] = useState(false)


  const submitForm = (e) => {
    e.preventDefault();
    createSwap({ tipoSwap, date, inicio, fin, razon, rank, crewcode: swapData.crewcode, roster: swapData.roster, userId: id[0] })
    setSwapDone(true)
  }
  //console.log(id)
  //console.log(swapData.roster)
  return (<>
    <div className='todoCreateSwapCaja'>
      <div className='datos'>

        {swapDone === true
          ? <div>
            <h2>
              Swap created
            </h2>
            <div>
              <Button
                onClick={() => navigate("/calendar")}
                variant="outlined" type="submit" endIcon={<AiOutlineCalendar />} className='buttonCreateSwap'>
                Go to calendar
              </Button>
            </div>
          </div>
          :
          <>
            <div>

              <h1>{tipoSwap ? <div className="splitCreateSwap">
                {tipoSwap}
                <Button
                  onClick={() => navigate("/calendar")}
                  variant="outlined" type="submit" endIcon={<AiOutlineCalendar />} className='buttonCreateSwap'
                >
                  Go to
                </Button>
              </div>
                :
                <div className='splitCreateSwap'>
                  Create swap
                  <Button
                    onClick={() => navigate("/calendar")}
                    variant="outlined" type="submit" endIcon={<AiOutlineCalendar />} className='buttonCreateSwap'

                  >
                    Go to
                  </Button></div>}</h1>

              <form onSubmit={submitForm} className='swapform'>
                <div>
                  <Select
                    displayEmpty
                    label="Selection"
                    value={tipoSwap} onChange={(e) => setTipoSwap(e.target.value)} required>
                    <MenuItem value="" disabled >Select</MenuItem>
                    <MenuItem value="Swap">Swap</MenuItem>
                    <MenuItem value="Offer">Offer Day Off</MenuItem>
                    <MenuItem value="Another">Looking for operate</MenuItem>
                  </Select>
                  {tipoSwap === "Swap" ?
                    <div><FormHelperText>You need a swap for that day</FormHelperText></div>
                    : <div></div>}
                  {tipoSwap === "Offer" ?
                    <div><FormHelperText>You are offering a day off</FormHelperText></div>
                    : <div></div>}
                  {tipoSwap === "Another" ?
                    <div><FormHelperText>You want to operate a flight or different duty</FormHelperText></div>
                    : <div></div>}

                </div>
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
export default CreateSwap