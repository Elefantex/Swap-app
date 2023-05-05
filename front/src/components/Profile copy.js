import React, { useEffect, useState } from "react";
import { useGetUsersByIdQuery } from "../app/apiSlice";
import { Link } from "react-router-dom";
import { fetchSwapsId } from "../app/slices";
import { useDispatch } from "react-redux";
import { useDeleteSwapMutation } from "../app/apiSlice";
import { useDeleteUserMutation } from "../app/apiSlice";
import { useGetSwapsQuery } from "../app/apiSlice";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./profile.css"
import { TiDelete } from 'react-icons/ti';
import { MdDelete, MdModeEdit } from "react-icons/md"
import PuffLoader from "react-spinners/ClipLoader";
import { fetchSwaps } from "../app/slices";
import { getSwaps } from "../app/slices";
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";
import { getNotes } from "../app/slices";
import { useDeleteNoteMutation, useUpdateNoteDeniedMutation, useUpdateNoteRequiredMutation } from "../app/apiSlice";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';






function Profile2() {

    const id = JSON.parse(localStorage.getItem('IDUserLogin'));
    const { data: swapData = [] } = useGetUsersByIdQuery(id)
    console.log(swapData.part)
    console.log(swapData._id)
    const navigate = useNavigate()

    const [nuevo, setNuevo] = useState([])


    const [fetchData, setFetchData] = useState([])
    const [fetchDataNotes, setFetchDataNotes] = useState([])

    const [deleteSwap] = useDeleteSwapMutation()
    const [deleteNote] = useDeleteNoteMutation()
    const [freshSwaps, setFreshSwaps] = useState([]);
    const [expiredSwaps, setExpiredSwaps] = useState([]);
    const [freshNotes, setFreshNotes] = useState([]);
    const [expiredNotes, setExpiredNotes] = useState([]);
    const [swaps, setSwaps] = useState(true)
    const [notes, setNotes] = useState(true)

    console.log("first")
    const [isLoading, setIsLoading] = useState(false);
    const [updateNoteDenied] = useUpdateNoteDeniedMutation()
    const [updateNoteRequired] = useUpdateNoteRequiredMutation()


    const { data: swapDataSwap = [] } = useGetSwapsQuery()
    console.log(swapDataSwap)
    const swapsID = swapDataSwap.filter(swap => swap.userId === swapData._id);
    console.log(swapsID)
    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])


    useEffect(() => {
        async function fetchSwapsInfo() {
            setIsLoading(true);

            const data = await getSwaps();
            const dataNotes = await getNotes()
            setNuevo(dataNotes)
            console.log(data);
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            dataNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log(dataNotes)
            setFetchData(data.filter(swap => swap.userId === swapData._id));
            setFetchDataNotes(dataNotes.filter(swap => swap.userId === swapData._id));
            setIsLoading(false);
        }
        fetchSwapsInfo();
    }, [swapData._id]);
    console.log(fetchDataNotes)


    useEffect(() => {
        // filter the swaps/offers that are expired
        const now = new Date();
        const expired = fetchData.filter(item => new Date(item.date) < now && item.date !== new Date().toISOString().slice(0, 10));
        setExpiredSwaps(expired);
        // filter the swaps/offers that are not expired
        const fresh = fetchData.filter(item => new Date(item.date) >= now || item.date === new Date().toISOString().slice(0, 10));
        setFreshSwaps(fresh);
        const expiredNotes = fetchDataNotes.filter(item => new Date(item.date) < now && item.date !== new Date().toISOString().slice(0, 10));
        setExpiredNotes(expiredNotes);
        // filter the swaps/offers that are not expired
        const freshNotes = fetchDataNotes.filter(item => new Date(item.date) >= now || item.date === new Date().toISOString().slice(0, 10));
        setFreshNotes(freshNotes);

    }, [fetchData, fetchDataNotes]);

    const deleteSwapFunction = async (id) => {
        console.log(id)
        await deleteSwap({ id }).unwrap();
        if (swaps) {
            setFreshSwaps((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));

        } else {
            setExpiredSwaps((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));
        }
        setOpenSwap(false);

    }
    const deleteNoteFunction = async (id) => {
        console.log(id)
        await deleteNote({ id }).unwrap();
        if (swaps) {
            setFetchDataNotes((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));

        } else {
            setFetchDataNotes((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));
        }
        setOpenNote(false);


    }
    const cambiosCheckRequired = async (e, id) => {
        const newRequested = e.target.checked;
        try {
            await updateNoteRequired({ id, requested: newRequested, denied: false });
            setFetchDataNotes((prevData) => {
                return prevData.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            requested: newRequested,
                            denied: false,

                        };
                    }
                    return item;
                });
            });
        } catch (err) {
            console.log(err);
        }
    };
    const cambiosCheckDenied = async (e, id, denied) => {
        const newDenied = e.target.checked;
        try {
            await updateNoteDenied({ id, denied: newDenied, requested: false });
            setFetchDataNotes((prevData) => {
                return prevData.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            denied: newDenied,
                            requested: false,
                        };
                    }
                    return item;
                });
            });
        } catch (err) {
            console.log(err);
        }
    };
    const [openNote, setOpenNote] = useState(false);
    const [openSwap, setOpenSwap] = useState(false);

    const handleClickOpenNote2 = () => {
        setOpenNote(true);
    };
    const handleClickOpenSwap2 = () => {
        setOpenSwap(true);
    };

    const handleCloseNote = () => {
        setOpenNote(false);
        setSelectedNote(null)
    };
    const handleCloseSwap = () => {
        setOpenSwap(false);
        setSelectedSwap(null)

    };
    const [selectedNote, setSelectedNote] = useState(null);
    const handleClickOpenNote = (note) => {
        setSelectedNote(note._id);
    }
    const [selectedSwap, setSelectedSwap] = useState(null);
    const handleClickOpenSwap = (note) => {
        setSelectedSwap(note._id);
    }


    return (

        <>
            <div className="profileTodos">
                <div className="profileTipo">
                    <h2>
                        Welcome: {swapData.crewcode}

                    </h2>

                    <div className="swapTipoButton">
                        <Button variant="contained" className="editProfileButton"
                            style={{ backgroundColor: 'green' }}>
                            <Link to={swapData._id}>
                                Edit profile <MdModeEdit />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div>
                    <h3>
                        Rank: {swapData.rank}
                    </h3>
                </div>
                <div>
                    <h3>
                        Roster: {swapData.roster}
                    </h3>
                </div>
                <div>
                    <h4>
                        {swapData.part ?
                            <div>You are looking for part time</div>
                            : <div>You are not looking for part time</div>}
                    </h4>

                </div>

                <h1>Created Swaps:</h1>
                <PuffLoader
                    color="#000000"
                    loading={isLoading}
                    size={30}
                    speedMultiplier="0.8"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />

                {swaps
                    ? <>

                        <Button variant="contained" className="buttonProfile"
                            onClick={() => { setSwaps(true) }}
                            style={{ backgroundColor: '#26C3FF' }}>
                            New</Button>
                        <Button variant="outlined" className="buttonProfile"
                            onClick={() => { setSwaps(false) }}
                        >Old</Button>

                        <div >


                            {
                                freshSwaps.length > 0 ?
                                    < div > <b>Swaps / Offer day off:</b>{freshSwaps.map((item) => {
                                        const fechaOriginal = item.date
                                        const partes = fechaOriginal.split('-');
                                        const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];
                                        return (
                                            <>
                                                <div className="swapProfile">
                                                    <div className="swapTipo">
                                                        <b>{item.tipoSwap}</b>
                                                        <div className="swapTipoButton">
                                                            <Button onClick={() => handleClickOpenSwap(item)} endIcon={<TiDelete />} className="buttonDeleteSwap" color="error" variant="contained"> Delete Swap</Button>
                                                        </div>
                                                        <Dialog
                                                            open={selectedSwap === item._id}
                                                            onClose={handleCloseSwap}
                                                            aria-labelledby="alert-dialog-title"
                                                            aria-describedby="alert-dialog-description"
                                                        >
                                                            <DialogTitle id="alert-dialog-title">
                                                                {"Delete Swap?"}
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <div id="alert-dialog-description">
                                                                    Once deleted the info will be erased.
                                                                </div>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={handleCloseSwap} style={{
                                                                    position: 'absolute',
                                                                    bottom: 8,
                                                                    left: 10,
                                                                }}
                                                                    color="success"
                                                                    variant="contained"
                                                                >Cancel</Button>
                                                                <Button
                                                                    onClick={() => deleteSwapFunction(item._id)} endIcon={<TiDelete />}
                                                                    //onClick={handleClose}
                                                                    autoFocus
                                                                    color="error"
                                                                    variant="contained">
                                                                    Delete
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                    <div className="swapItem">
                                                        Date: {fechaFormateada}
                                                    </div>
                                                    <div className="swapItem">
                                                        Start hour: {item.inicio}
                                                    </div>
                                                    <div className="swapItem">
                                                        End hour: {item.fin}
                                                    </div>
                                                    <div className="swapItem">
                                                        Info: {item.razon}
                                                    </div>


                                                </div >
                                            </>
                                        )
                                    })}</div>
                                    : <div><b>No Swaps</b>

                                    </div>
                            }
                        </div>
                    </>
                    : <>
                        <Button variant="outlined" className="buttonProfile" onClick={() => { setSwaps(true) }}
                        >
                            New</Button>
                        <Button variant="contained" className="buttonProfile" onClick={() => { setSwaps(false) }}
                            style={{ backgroundColor: '#26C3FF' }}

                        >Old</Button>

                        {
                            expiredSwaps.length > 0 ?
                                <div><b>Swaps / Offer day off expired:</b>{expiredSwaps.map((item) => {
                                    const fechaOriginal = item.date
                                        const partes = fechaOriginal.split('-');
                                        const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];
                                    return (
                                        <>
                                            <div className="swapProfile itemPartfinderDenied">

                                                <div className="swapTipo">
                                                    <b>{item.tipoSwap}</b>
                                                    <div className="swapTipoButton">
                                                        <Button onClick={() => handleClickOpenSwap(item)} endIcon={<TiDelete />} className="buttonDeleteSwap" color="error" variant="contained"> Delete Swap</Button>
                                                    </div>
                                                    <Dialog
                                                        open={selectedSwap === item._id}
                                                        onClose={handleCloseSwap}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"


                                                    >
                                                        <DialogTitle id="alert-dialog-title">
                                                            {"Delete Swap?"}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <div id="alert-dialog-description">
                                                                Once deleted the info will be erased.
                                                            </div>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleCloseSwap} style={{
                                                                position: 'absolute',
                                                                bottom: 8,
                                                                left: 10,
                                                            }}
                                                                color="success"
                                                                variant="contained"
                                                            >Cancel</Button>
                                                            <Button
                                                                onClick={() => deleteSwapFunction(item._id)} endIcon={<TiDelete />}
                                                                //onClick={handleClose}
                                                                autoFocus
                                                                color="error"
                                                                variant="contained">
                                                                Delete
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </div>
                                                <div className="swapItem">
                                                    Date: {fechaFormateada}
                                                </div>
                                                <div className="swapItem">
                                                    Start hour: {item.inicio}
                                                </div>
                                                <div className="swapItem">
                                                    End hour: {item.fin}
                                                </div>
                                                <div className="swapItem">
                                                    Info: {item.razon}
                                                </div>


                                            </div>

                                        </>
                                    )
                                })}</div>
                                : <div><b>No expired Swaps</b></div>
                        }</>
                }

            </div >

            <h1>Created Notes:</h1>
            <PuffLoader
                color="#000000"
                loading={isLoading}
                size={30}
                speedMultiplier="0.8"
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            {notes
                ? <>
                    <Button variant="contained" className="buttonProfile"
                        onClick={() => { setNotes(true) }}
                        style={{ backgroundColor: '#26C3FF' }}>
                        New</Button>
                    <Button variant="outlined" className="buttonProfile"
                        onClick={() => { setNotes(false) }}
                    >Old</Button>
                    <div>
                        {freshNotes.length > 0
                            ? <div>

                                {freshNotes.map((item, index) => {
                                    const fechaOriginal = item.date
                                    const partes = fechaOriginal.split('-');
                                    const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];
                                    const today = new Date().toISOString().slice(0, 10);
                                    const className = item.date < today ? "swapProfileDenied" : "swapProfile";
                                    const classExpired = item.date < today ? "EXPIRED" : "";
                                    const classDenied = item.denied
                                    return (
                                        <>
                                            <div className={className}>
                                                <div className="swapTipo">
                                                    <b>
                                                        {classDenied
                                                            ? <del>{item.crewcode} {classExpired}</del>
                                                            : <>{item.crewcode} {classExpired}</>
                                                        }

                                                    </b>

                                                    <div className="swapTipoButton">
                                                        <Button onClick={() => handleClickOpenNote(item)}
                                                            endIcon={<TiDelete />} className="buttonDeleteSwap" color="error"
                                                            variant="contained"
                                                        >Delete Note</Button>
                                                    </div>
                                                    <Dialog
                                                        open={selectedNote === item._id}
                                                        onClose={handleCloseNote}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"

                                                    >
                                                        <DialogTitle id="alert-dialog-title">
                                                            {"Delete Note?"}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <div id="alert-dialog-description">
                                                                Once deleted the info will be erased.
                                                            </div>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleCloseNote} style={{
                                                                position: 'absolute',
                                                                bottom: 8,
                                                                left: 10,
                                                            }}
                                                                color="success"
                                                                variant="contained"
                                                            >Cancel</Button>
                                                            <Button
                                                                onClick={() => deleteNoteFunction(item._id)} endIcon={<TiDelete />}
                                                                //onClick={handleClose}
                                                                autoFocus
                                                                color="error"
                                                                variant="contained">
                                                                Delete
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </div>
                                                <div className="swapItem">
                                                    {classDenied
                                                        ? <del>Date: {fechaFormateada}</del>
                                                        : <>Date: {fechaFormateada}</>
                                                    }
                                                </div>
                                                <div className="swapItem">
                                                    {classDenied
                                                        ? <del>Start hour: {item.inicio}</del>
                                                        : <>Start hour: {item.inicio}</>
                                                    }

                                                </div>
                                                <div className="swapItem">
                                                    {classDenied
                                                        ? <del>End hour: {item.fin}</del>
                                                        : <>End hour: {item.fin}</>
                                                    }

                                                </div>
                                                <div className="swapItem">
                                                    {classDenied
                                                        ? <del>Info: {item.razon}</del>
                                                        : <>Info: {item.razon}</>
                                                    }

                                                </div>
                                                <div className="swapItem">
                                                    Requested: <input style={{
                                                        marginRight: "30px"
                                                    }}
                                                        type="checkbox"
                                                        checked={item.requested}
                                                        defaultChecked={item.requested}
                                                        onChange={(e) => cambiosCheckRequired(e, item._id, item.requested)}
                                                    />

                                                    Denied: <input
                                                        type="checkbox"
                                                        checked={item.denied}
                                                        defaultChecked={item.denied}
                                                        onChange={(e) => cambiosCheckDenied(e, item._id, item.denied)}
                                                    />

                                                </div>
                                            </div >
                                        </>
                                    )
                                })}


                            </div>
                            : <div>No notes</div>}
                    </div>
                </>

                : <>

                    <Button variant="outlined" className="buttonProfile"
                        onClick={() => { setNotes(true) }}
                    >
                        New</Button>
                    <Button variant="contained" className="buttonProfile"
                        onClick={() => { setNotes(false) }}
                        style={{ backgroundColor: '#26C3FF' }}
                    >Old</Button>
                    {expiredNotes.length > 0
                        ? <div>

                            {expiredNotes.map((item, index) => {
                                const fechaOriginal = item.date
                                const partes = fechaOriginal.split('-');
                                const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];
                                const today = new Date().toISOString().slice(0, 10);
                                const className = item.date < today ? "swapProfileDenied" : "swapProfile";
                                const classExpired = item.date < today ? "EXPIRED" : "";
                                const classDenied = item.denied

                                return (
                                    <>
                                        <div className={className}>
                                            <div className="swapTipo">
                                                <b>
                                                    {classDenied
                                                        ? <del>{item.crewcode} {classExpired}</del>
                                                        : <>{item.crewcode} {classExpired}</>
                                                    }</b>

                                                <div className="swapTipoButton">
                                                    <Button onClick={() => handleClickOpenNote(item)}
                                                        endIcon={<TiDelete />} className="buttonDeleteSwap" color="error"
                                                        variant="contained"
                                                    >Delete Note</Button>
                                                </div>
                                                <Dialog
                                                    open={selectedNote === item._id}
                                                    onClose={handleCloseNote}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"

                                                >
                                                    <DialogTitle id="alert-dialog-title">
                                                        {"Delete Note?"}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <div id="alert-dialog-description">
                                                            Once deleted the info will be erased.
                                                        </div>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleCloseNote} style={{
                                                            position: 'absolute',
                                                            bottom: 8,
                                                            left: 10,
                                                        }}
                                                            color="success"
                                                            variant="contained"
                                                        >Cancel</Button>
                                                        <Button
                                                            onClick={() => deleteNoteFunction(item._id)} endIcon={<TiDelete />}
                                                            //onClick={handleClose}
                                                            autoFocus
                                                            color="error"
                                                            variant="contained">
                                                            Delete
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                            <div className="swapItem">
                                                {classDenied
                                                    ? <del>Date: {fechaFormateada}</del>
                                                    : <>Date: {fechaFormateada}</>
                                                }
                                            </div>
                                            <div className="swapItem">
                                                {classDenied
                                                    ? <del>Start hour: {item.inicio}</del>
                                                    : <>Start hour: {item.inicio}</>
                                                }

                                            </div>
                                            <div className="swapItem">
                                                {classDenied
                                                    ? <del>End hour: {item.fin}</del>
                                                    : <>End hour: {item.fin}</>
                                                }

                                            </div>
                                            <div className="swapItem">
                                                {classDenied
                                                    ? <del>Info: {item.razon}</del>
                                                    : <>Info: {item.razon}</>
                                                }

                                            </div>
                                            <div className="swapItem">
                                                Requested: <input style={{
                                                    marginRight: "30px"
                                                }}
                                                    type="checkbox"
                                                    checked={item.requested}
                                                    defaultChecked={item.requested}
                                                    onChange={(e) => cambiosCheckRequired(e, item._id, item.requested)}
                                                />

                                                Denied: <input
                                                    type="checkbox"
                                                    checked={item.denied}
                                                    defaultChecked={item.denied}
                                                    onChange={(e) => cambiosCheckDenied(e, item._id, item.denied)}
                                                />

                                            </div>
                                        </div >
                                    </>
                                )
                            })}


                        </div>
                        : <div>No old notes</div>}
                </>}




        </>
    )
}

export default Profile2