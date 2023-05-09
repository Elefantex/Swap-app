import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useRef, useState } from "react";
import { TiDelete } from 'react-icons/ti';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useCreateMessageChatMutation, useDeleteConversationMutation, useGetUsersByIdQuery } from "../../app/apiSlice";
import { fetchMessagesId } from "../../app/messagesSlice";
import { fetchConversation } from "../../app/slices";
import Conversation from "./Conversation";
import Message from "./Message";


import "./Messenger.css";

function Messenger() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)

    const [createMessage] = useCreateMessageChatMutation();
    const [deleteConversation] = useDeleteConversationMutation()
    const scrollRef = useRef()
    const socket = useRef()
    const id = JSON.parse(localStorage.getItem('IDUserLogin'));



    useEffect(() => {
        if (!id) {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        socket.current = io("ws://localhost:3002")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })

    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])





    const { data: data = [] } = useGetUsersByIdQuery(id)
    //console.log(data)
    const deleteConversationChat = async (conversationId) => {

        try {
            const result = await deleteConversation({ conversationId });
            //console.log(result); // log the result to the console
            setConversations(conversations.filter(c => c._id !== conversationId));
            setCurrentChat(null)
            setNewMessage("")

        } catch (err) {
            //console.log(err); // log any errors to the console
        }

    }

    useEffect(() => {
        socket.current.emit("addUser", data._id)
        socket.current.on("getUsers", data => {
            //console.log(data)
        })
    }, [data])

    useEffect(() => {
        const getConversations = async () => {
            const response = await dispatch(fetchConversation(id));
            setConversations(response.payload);
        };
        getConversations();
    }, [dispatch, arrivalMessage])
    //console.log(conversations)



    useEffect(() => {
        const getMessages = async () => {
            const response = await dispatch(fetchMessagesId(currentChat?._id));
            setMessages(response.payload);
        };
        getMessages();
        const intervalId = setInterval(getMessages, 3000); // Set a timeout every 3000ms
        return () => clearInterval(intervalId);
    }, [dispatch, currentChat, newMessage])
   // console.log(messages)


    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await createMessage({ sender: data._id, text: newMessage, conversationId: currentChat._id })
        const receiverId = currentChat.members.find(member => member !== data._id)

        socket.current.emit("sendMessage", {
            senderId: data._id,
            receiverId,
            text: newMessage,
        })
        setNewMessage("")
        setMessages([...messages, res.data])
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])
    const [open, setOpen] = useState(false)
    const handleChatClick = (conversation, index) => {
        if (conversation === currentChat) {
            setCurrentChat(null);
            //console.log(index)
            setOpen(prevState => ({ ...prevState, [index]: false }));
        } else {
            setCurrentChat(conversation);
           // console.log(index)
            setOpen(prevState => {
                const newOpen = {};
                Object.keys(prevState).forEach(key => {
                    newOpen[key] = key === index;
                });
                return newOpen;
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    };
    const [openSwap, setOpenSwap] = useState(false);
    const [selectedSwap, setSelectedSwap] = useState(null);

    const handleCloseSwap = () => {
        setOpenSwap(false);
        setSelectedSwap(null)


    };
    const handleClickOpenSwap = (note) => {
        setSelectedSwap(note);
    }



    return (
        <>

            <div className="prueba">

                <div>
                    <h1 >
                        Welcome :  {data.crewcode}

                    </h1>

                    <div className="conversations">
                        <div className="conversationsTry">

                            {conversations.map((item, index) =>
                                <>

                                    <div onClick={() => handleChatClick(item, index)}
                                    >
                                        <div
                                            className="conversationMessenger"

                                            style={{ backgroundColor: currentChat === item ? "blue" : "gray" }} >
                                            <Conversation conversation={item} currentUser={data._id} />
                                        </div>

                                    </div>
                                </>

                            )}

                        </div>



                    </div>

                </div>
                <div className="messenger-container">
                    <div className="current-chat">
                        <div className="chatBoxWrapper">

                            {
                                currentChat
                                    ? <>
                                        {currentChat ?
                                            <div>
                                                <Button onClick={() => { handleClickOpenSwap(currentChat?._id) }} className="deleteConversation"

                                                    color="error"
                                                    variant="contained">Delete conversation</Button>
                                                <Dialog
                                                    open={selectedSwap === currentChat._id}
                                                    onClose={handleCloseSwap}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">
                                                        {"Delete Conversation?"}
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
                                                            onClick={() => deleteConversationChat(currentChat?._id)} endIcon={<TiDelete />}
                                                            //onClick={handleClose}
                                                            autoFocus
                                                            color="error"
                                                            variant="contained">
                                                            Delete
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                            : <div></div>
                                        }
                                        <div className="chatBoxTop">

                                            {messages.map((m) =>
                                                <div ref={scrollRef}>
                                                    <Message message={m} own={m.sender === data._id} />
                                                </div>

                                            )}

                                        </div>
                                        <div className="chatBoxBottom">
                                            <textarea
                                                className="chatMessageInput"
                                                name=""
                                                id=""
                                                cols="30"
                                                rows="10"
                                                placeholder="Write something..."
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                value={newMessage}
                                                onKeyDown={handleKeyDown}
                                            >
                                            </textarea>
                                            <button className="chatSubmitButton"
                                                onClick={handleSubmit}>Send</button>
                                        </div>

                                    </>
                                    :
                                    <div>Open a conversation to start a chat</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Messenger