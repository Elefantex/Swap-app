import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { TiDelete } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDeleteNoteMutation, useGetNotesDateQuery, useUpdateNoteDeniedMutation, useUpdateNoteRequiredMutation } from '../app/apiSlice';
import { getNotesDate } from '../app/slices';
import "./swap.css";


function Note() {
    const [data, setData] = useState([]);
    const { cellDate } = useParams();
    const navigate = useNavigate()
    const [updateNoteDenied] = useUpdateNoteDeniedMutation()
    const [updateNoteRequired] = useUpdateNoteRequiredMutation()
    const id = localStorage.getItem("IDUserLogin")
    const id2 = JSON.parse(id)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])



    const [deleteSwap] = useDeleteNoteMutation()
    const cambiosCheckRequired = async (e, id, requested) => {
        const newRequested = e.target.checked;
        try {
            await updateNoteRequired({ id, requested: newRequested, denied: false });
            const newData = [...data];
            const index = newData.findIndex((item) => item._id === id);
            newData[index] = { ...newData[index], requested: newRequested, denied: false };
            setData(newData);
        } catch (err) {
            //console.log(err);
        }
    };
    const cambiosCheckDenied = async (e, id, denied) => {
        const newDenied = e.target.checked;
        try {
            await updateNoteDenied({ id, denied: newDenied, requested: false });
            const newData = [...data];
            const index = newData.findIndex((item) => item._id === id);
            newData[index] = { ...newData[index], denied: newDenied, requested: false };
            setData(newData);
            //await refetch(); // Reload the data
        } catch (err) {
            //console.log(err);
        }
    };


    const { data: swapData = [], refetch } = useGetNotesDateQuery(cellDate);
   // console.log(swapData)
    const deleteSwapFunction = async (id) => {
        //console.log(id)
        await deleteSwap({ id }).unwrap();
        //window.location.reload()
        setOpenSwap(false);
        setSelectedSwap(null)
        setData((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id))
        

    }
    const [nuevo, setNuevo] = useState([])
    useEffect(() => {
        async function fetchData() {
            const data = await getNotesDate(cellDate);
            //console.log(data)
            setNuevo(data);
        }
        fetchData();
    }, [dispatch, deleteSwap])
   


    useEffect(() => {
        setData(nuevo);
    }, [setNuevo, nuevo, setData]);


    const dataMatchSwap = data.filter((dataItem) => dataItem.date === cellDate && dataItem.userId === id2[0])
    //console.log(dataMatchSwap)


    const fechaOriginal = cellDate
    const partes = fechaOriginal.split('-');
    const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];


    const [openSwap, setOpenSwap] = useState(false);
    const [selectedSwap, setSelectedSwap] = useState(null);

    const handleClickOpenSwap = (note) => {
        setSelectedSwap(note._id);
    }
    const handleClickOpenSwapReal = () => {
        
        setOpenSwap(true);
    };
    const handleCloseSwap = () => {
        setOpenSwap(false);
        setSelectedSwap(null)
    };
    return (
        <div className='profileTodos'>
            <div className='splitCreateSwap'>
                <h1>Info about your requests {fechaFormateada}</h1>
                <div className='createTituloSwap'>
                    <Link to={`/createNote`} state={{ dateFrom: cellDate }}>

                        <div>
                            <Button className="buttonDeleteSwap" color="success" variant="contained"> Create Note</Button>

                        </div>

                    </Link>
                </div>
            </div>

            {dataMatchSwap.length > 0 ? <div> {
                dataMatchSwap.map((item, index) => (
                    <div key={item._id}

                        className={item.denied === true ? "itemPartfinderDenied" : "itemPartfinderRequested"}
                    >
                        <h2>{item.tipoSwap}</h2>
                        <h5>Requested to CrewCode: {item.crewcode}</h5>
                        <h5>Start hour: {item.inicio}</h5>
                        <h5>End hour: {item.fin}</h5>
                        <p>Info about it: {item.razon}</p>
                        <p>
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

                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {item.userId === id2[0]
                                ? <div
                                >
                                    <Button onClick={()=>handleClickOpenSwap(item)} endIcon={<TiDelete />} className="buttonDeleteSwap" color="error" variant="contained"> Delete Note</Button>
                                </div>
                                : <div></div>}


                        </div>

                        <Dialog
                            open={selectedSwap ===item._id}
                            onClose={handleCloseSwap}
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
                ))

            }


            </div> : <div>

                <Link to={`/createnote`} state={{ dateFrom: cellDate }}>

                    Create your first one

                </Link>

            </div>
            }
        </div >
    );
}

export default Note;
