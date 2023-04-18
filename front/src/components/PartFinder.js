import React, { useEffect, useState } from "react";
import { fetchUsers } from "../app/slices";
import { useDispatch } from "react-redux";
import { useGetUsersQuery, useCreateMessageChatMutation, useCreateConversationMutation, useGetUsersByIdQuery } from "../app/apiSlice";
import { fetchUsersInfo } from "../app/slices";
import { useNavigate } from "react-router-dom";
import "./partFinder.css"
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";


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


    const todo = async (receiverId) => {
        setErrorConversation(false)
        setSuccesConversation(false)

        console.log("sadasd");
        console.log(receiverId);
        console.log(id2[0]);
        await createChat({ senderId: id2[0], receiverId: receiverId })

            .then((savedConversation) => {
                createMessage({ sender: id2[0], text: newMessage, conversationId: savedConversation.data._id })
                setNewMessage("")
                //setIsOpen(false)
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
                                            <div>{item.crewcode}</div>
                                            <div>Roster: {item.roster}</div>
                                            <div>Rank: {item.rank}</div>
                                        </div>
                                        {isOpen[index]
                                            ? <div></div>
                                            : <div>
                                                <button onClick={() => {
                                                    setErrorConversation(false);
                                                    setSuccesConversation(false);
                                                    setIsOpen(prevState => ({ ...prevState, [index]: !prevState[index] }));
                                                    setNewMessage("")

                                                }}
                                                    className="buttonSendPart">Send a message</button>
                                            </div>}
                                        {
                                            isOpen[index] === true
                                                ? <>
                                                    <div>
                                                        <textarea name=""
                                                            id=""
                                                            cols="30"
                                                            style={{ width: "85%", margin: "5px" }}
                                                            rows="5"
                                                            placeholder="Write something..."
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={newMessage[index] || ""}
                                                            required
                                                        >
                                                        </textarea>
                                                        <div className="buttonPartFinder">
                                                            <button onClick={() => todo(item._id)} className="buttonSendPart"> Send </button>
                                                        </div>
                                                    </div>
                                                    {errorConversation
                                                        ? <div><Alert severity="error">
                                                            <AlertTitle>Warning</AlertTitle>
                                                            You have already a conversation
                                                        </Alert></div>
                                                        : <div></div>}
                                                    {succesConversation
                                                        ? <div><Alert severity="success">
                                                            <AlertTitle>Succcess</AlertTitle>
                                                            Message sent successfully
                                                        </Alert></div>
                                                        : <div></div>}

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