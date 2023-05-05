import React, { useEffect, useState } from "react";
import { fetchUsers } from "../app/slices";
import { useDispatch } from "react-redux";
import { useGetUsersQuery, useCreateMessageChatMutation, useCreateConversationMutation, useGetUsersByIdQuery } from "../app/apiSlice";
import { fetchUsersInfo } from "../app/slices";
import { useNavigate } from "react-router-dom";
import "./partFinder.css"
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


function PartFinder() {
    const id = localStorage.getItem("IDUserLogin")
    const id2 = JSON.parse(id)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [fetchData, setFetchData] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("")
    const [createMessage] = useCreateMessageChatMutation();
    const [errorConversation, setErrorConversation] = useState(false)
    const [createChat] = useCreateConversationMutation();
    const [succesConversation, setSuccesConversation] = useState(false)

    const { data: swapData = [] } = useGetUsersQuery()
    const { data: swapData2 = [] } = useGetUsersByIdQuery(id2)
    console.log(swapData2.part)

    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])


    useEffect(() => {
        const filteredData = swapData.filter(user => user.part === true);
        setFetchData(filteredData);
    }, [swapData]);

    console.log(fetchData)

    const [openError, setOpenError] = useState(false)
    const todo = async (receiverId, index) => {
        setErrorConversation(false)
        setSuccesConversation(false)

        console.log("sadasd");
        console.log(receiverId);
        console.log(id2[0]);
        await createChat({ senderId: id2[0], receiverId: receiverId })

            .then((savedConversation) => {
                createMessage({ sender: id2[0], text: newMessage[index], conversationId: savedConversation.data._id })
                setNewMessage("")
                //setIsOpen(false)
                setSuccesConversation(true)
                setOpenSwap(true)
            })
            .catch((error) => {
                console.error(error);
                setErrorConversation(true)
                setOpenError(true)
            });
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        setNewMessage((prevState) => ({ ...prevState, [index]: value }));
        console.log(newMessage[index])
    };

    const [openSwap, setOpenSwap] = useState(false);

    const handleCloseSwap = () => {
        setOpenSwap(false);
        setOpenError(false)

    };


    return (
        <>
            <div className="profileTodos">


                {fetchData.length > 0
                    ? <div>

                        {fetchData.map((item, index) => {
                            return (
                                <>
                                    <div className="itemPartfinder">

                                        <div onClick={() => {
                                            setErrorConversation(false);
                                            setSuccesConversation(false);
                                            setIsOpen(prevState => ({ ...prevState, [index]: !prevState[index] }));
                                            setNewMessage("")

                                        }} >
                                            {item._id !== id2[0]
                                                ? <div>{item.crewcode}</div>
                                                : <div>{item.crewcode} (Yourself)</div>
                                            }
                                            <div>Roster: {item.roster}</div>
                                            <div>Rank: {item.rank}</div>
                                        </div>

                                        {item._id !== id2[0]
                                            ? <div>

                                                {isOpen[index] === true
                                                    ? <div></div>
                                                    : <div>
                                                        <button onClick={() => {
                                                            
                                                            setIsOpen(prevState => ({ ...prevState, [index]: !prevState[index] }));
                                                            setNewMessage("")

                                                        }}
                                                            className="buttonSendPart">Send a message</button>
                                                    </div>}
                                            </div>
                                            : <div>
                                            </div>}

                                        {
                                            isOpen[index] === true && item._id !== id2[0]
                                                ? <>
                                                    <div>
                                                        <textarea name=""
                                                            id=""
                                                            cols="30"
                                                            style={{ width: "85%", margin: "5px" }}
                                                            rows="5"
                                                            placeholder="Write something..."
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={newMessage[index]}
                                                            required
                                                        >
                                                        </textarea>
                                                        <div className="buttonPartFinder">
                                                            <button onClick={() => todo(item._id, index)} className="buttonSendPart"> Send </button>
                                                        </div>
                                                    </div>
                                                    <Dialog
                                                        open={openSwap}
                                                        onClose={handleCloseSwap}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                    >

                                                        <DialogContent>
                                                            <Alert severity="success">
                                                                <AlertTitle>Succcess</AlertTitle>
                                                                Message sent successfully
                                                            </Alert>
                                                        </DialogContent>

                                                    </Dialog>
                                                    <Dialog
                                                        open={openError}
                                                        onClose={handleCloseSwap}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                    >

                                                        <DialogContent>
                                                            <Alert severity="error">
                                                                <AlertTitle>Warning</AlertTitle>
                                                                You already have a conversation,
                                                                <div>check it on Messenger</div>
                                                            </Alert>
                                                        </DialogContent>

                                                    </Dialog>


                                                </>
                                                : <></>
                                        }

                                    </div >

                                </>

                            )
                        })}


                    </div >
                    : <div>No one is looking for Part time</div>
                }

            </div >

        </>
    )
}
export default PartFinder