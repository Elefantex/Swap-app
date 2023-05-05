import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useGetSwapsDateQuery, useCreateMessageChatMutation, useGetUsersByIdQuery } from '../app/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { fetchInfoCrewcode, fetchConversation } from '../app/slices';
import { useCreateConversationMutation } from '../app/apiSlice';
import { fetchSwapsDate } from '../app/slices';
import { useDeleteSwapMutation } from '../app/apiSlice';
import { getSwapsDate } from '../app/slices';
import "./swap.css"
import { TiDelete } from "react-icons/ti"
import { TbMessageDots } from "react-icons/tb"
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


function Swap() {
    const [data, setData] = useState([]);
    const { cellDate } = useParams();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("")
    const [errorConversation, setErrorConversation] = useState(false)
    const [succesConversation, setSuccesConversation] = useState(false)
    console.log(cellDate)
    const RankUser = localStorage.getItem('Rank');
    const id = localStorage.getItem("IDUserLogin")
    const id2 = JSON.parse(id)
    const [conversationId, setConversationId] = useState(null); // state to store the conversation ID
    const dispatch = useDispatch()
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])



    const [createChat] = useCreateConversationMutation();
    const [deleteSwap] = useDeleteSwapMutation()


    const [createMessage] = useCreateMessageChatMutation();
    const { data: dataIdQuery = [] } = useGetUsersByIdQuery()


    const { data: swapData = [], refetch } = useGetSwapsDateQuery(cellDate);
    console.log(swapData)
    const deleteSwapFunction = async (id) => {
        console.log(id)
        await deleteSwap({ id }).unwrap();
        window.location.reload()
        setOpenSwap(false);

    }
    const [nuevo, setNuevo] = useState([])
    useEffect(() => {
        async function fetchData() {
            const data = await dispatch(fetchSwapsDate(cellDate));
            setNuevo(data.payload);
        }
        fetchData();
    }, [dispatch, deleteSwap])
    console.log(nuevo)


    useEffect(() => {
        setData(nuevo);
    }, [nuevo, setData, conversationId]);



    const dataMatchSwap = data.filter((dataItem) => {
        if (JSON.parse(RankUser) === "JU") {
            return (dataItem.rank === RankUser || dataItem.rank === `"JUPU"`);
        } else if (JSON.parse(RankUser) === "JUPU") {
            return (dataItem.rank === `"JU"` || dataItem.rank === RankUser || dataItem.rank === `"PU"`);
        } else if (JSON.parse(RankUser) === "PU") {
            return (dataItem.rank === `"JUPU"` || dataItem.rank === RankUser);
        } else {
            // handle error case
            return false;
        }
    });
    const todo = async (receiverId, index) => {

        console.log("sadasd");
        console.log(receiverId);
        console.log(id2[0]);
        await createChat({ senderId: id2[0], receiverId: receiverId })

            .then((savedConversation) => {
                createMessage({ sender: id2[0], text: newMessage[index], conversationId: savedConversation.data._id })
                setNewMessage("")
                setSuccesConversation(true)
            })
            .catch((error) => {
                console.error(error);
                setErrorConversation(true)
            });
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        setNewMessage((prevState) => ({ ...prevState, [index]: value }));
        console.log(newMessage[index])
    };
    const fechaOriginal = cellDate
    const partes = fechaOriginal.split('-');
    const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

    const [openSwap, setOpenSwap] = useState(false);
    const handleClickOpenSwap = () => {
        setOpenSwap(true);
    };
    const handleCloseSwap = () => {
        setOpenSwap(false);
    };
    return (
        <div className='profileTodos'>
            <div className='splitCreateSwap'>
                <h1>Swaps available for {fechaFormateada}</h1>
                <div className='createTituloSwap'>
                    <Link to={`/create`} state={{ dateFrom: cellDate }}>
                        <div>
                            <Button className="buttonDeleteSwap" color="success" variant="contained"> Create Swap</Button>
                        </div>

                    </Link>
                </div>
            </div>
            {dataMatchSwap ? <div> {
                dataMatchSwap.map((item, index) => (
                    <div key={item._id} className="itemPartfinder">
                        <h2>{item.tipoSwap}</h2>
                        <h5>CrewCode: {item.crewcode}</h5>
                        <h5>Start hour: {item.inicio}</h5>
                        <h5>End hour: {item.fin}</h5>
                        <h5>Roster: {item.roster}</h5>
                        <p>Info about it: {item.razon}</p>
                        <p>{item.userId === id2[0]
                            ? <div></div>
                            : <div>
                                <button className="buttonSendPart"
                                    onClick={() => {
                                        setNewMessage("");
                                        setErrorConversation(false);
                                        setSuccesConversation(false);
                                        setIsOpen(prevState => ({ ...prevState, [index]: !prevState[index] }));
                                    }}>Send a message <TbMessageDots /></button>{isOpen[index] === true
                                        ? <>
                                            <div>
                                                <textarea name=""
                                                    id=""
                                                    cols="30"
                                                    rows="10"
                                                    placeholder="Write something..."
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={newMessage[index]}
                                                    required
                                                >
                                                </textarea>
                                                <Button variant="contained" className="buttonProfile" style={{ backgroundColor: '#26C3FF', margin: "0px 0px 0px 10px" }} onClick={() => todo(item.userId, index)}>Send</Button>
                                            </div>
                                            {errorConversation
                                                ? <div>

                                                    <Alert severity="error">
                                                        <AlertTitle>Warning</AlertTitle>
                                                        You have already a conversation
                                                    </Alert>
                                                </div>
                                                : <div></div>}
                                            {succesConversation
                                                ? <div>
                                                    <Alert severity="success">
                                                        <AlertTitle>Succcess</AlertTitle>
                                                        Message sent successfully
                                                    </Alert>
                                                </div>
                                                : <div></div>}

                                        </>
                                        : <></>}
                            </div>}
                            {item.userId === id2[0]
                                ? <>

                                    <Button onClick={handleClickOpenSwap} endIcon={<TiDelete />} className="buttonDeleteSwap" color="error" variant="contained"> Delete Swap</Button>
                                    <Dialog
                                        open={openSwap}
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
                                    </Dialog></>
                                : <div></div>}


                        </p>
                    </div>
                ))
            }</div> : <div>No swaps</div>}
        </div>
    );
}

export default Swap;
