import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDeleteNoteMutation, useGetNotesDateQuery } from '../app/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useUpdateNoteDeniedMutation, useUpdateNoteRequiredMutation } from '../app/apiSlice';
import "./swap.css"
import { TiDelete } from "react-icons/ti"
import { TbMessageDots } from "react-icons/tb"
import { fetchNotesDate, getNotesDate } from '../app/slices';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function Note() {
    const [data, setData] = useState([]);
    const { cellDate } = useParams();
    const navigate = useNavigate()
    const [updateNoteDenied] = useUpdateNoteDeniedMutation()
    const [updateNoteRequired] = useUpdateNoteRequiredMutation()
    const id = localStorage.getItem("IDUserLogin")
    const id2 = JSON.parse(id)
    const [conversationId, setConversationId] = useState(null); // state to store the conversation ID
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
            console.log(err);
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
            await refetch(); // Reload the data
        } catch (err) {
            console.log(err);
        }
    };


    const { data: swapData = [], refetch } = useGetNotesDateQuery(cellDate);
    console.log(swapData)
    const deleteSwapFunction = async (id) => {
        console.log(id)
        await deleteSwap({ id }).unwrap();
        window.location.reload()
    }
    const [nuevo, setNuevo] = useState([])
    useEffect(() => {
        async function fetchData() {
            const data = await getNotesDate(cellDate);
            console.log(data)
            setNuevo(data);
        }
        fetchData();
    }, [dispatch, deleteSwap])
    console.log(nuevo)


    useEffect(() => {
        setData(nuevo);
    }, [setNuevo, nuevo, setData, conversationId]);


    const dataMatchSwap = data.filter((dataItem) => dataItem.date === cellDate && dataItem.userId === id2[0])
    console.log(dataMatchSwap)







    return (
        <div className='profileTodos'>
            <div className='tituloSwap'>
                <h1>Info about your swasps request</h1>
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
                                ><button className='buttonDeleteSwap' onClick={() => { deleteSwapFunction(item._id) }}>Delete <TiDelete /></button></div>
                                : <div></div>}


                        </div>
                    </div>
                ))
            }</div> : <div>

                <Link to={`/createnote`} state={{ dateFrom: cellDate }}>

                    Create your first one

                </Link>

            </div>
            }
        </div >
    );
}

export default Note;
