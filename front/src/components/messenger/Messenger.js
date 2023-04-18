import React, { useEffect } from "react";
import { useGetConversationsQuery, useGetUsersByIdQuery, useGetMessagesConversationQuery } from "../../app/apiSlice";
import { useState } from "react";
import Conversation from "./Conversation"
import { useDispatch } from "react-redux";
import { fetchMessagesId } from "../../app/messagesSlice";
import Message from "./Message"
import axios from "axios";
import { useCreateMessageChatMutation } from "../../app/apiSlice";
import { useRef } from "react";
import { io } from "socket.io-client"
import { useDeleteConversationMutation } from "../../app/apiSlice";
import { fetchConversation } from "../../app/slices";
import { useNavigate } from "react-router-dom";
import "./Messenger.css"

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
        socket.current = io("ws://localhsost:3002")
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



    //const { data: swapData = [] } = useGetConversationsQuery(id)
    //console.log(swapData)

    const { data: data = [] } = useGetUsersByIdQuery(id)
    //console.log(data)
    const deleteConversationChat = async (conversationId) => {

        try {
            const result = await deleteConversation({ conversationId });
            console.log(result); // log the result to the console
            setConversations(conversations.filter(c => c._id !== conversationId));
            setCurrentChat(null)
            setNewMessage("")

        } catch (err) {
            console.log(err); // log any errors to the console
        }

    }

    useEffect(() => {
        socket.current.emit("addUser", data._id)
        socket.current.on("getUsers", data => {
            console.log(data)
        })
    }, [data])

    useEffect(() => {
        const getConversations = async () => {
            const response = await dispatch(fetchConversation(id));
            setConversations(response.payload);
        };
        getConversations();
    }, [dispatch, arrivalMessage])

    useEffect(() => {
        const getMessages = async () => {
            const response = await dispatch(fetchMessagesId(currentChat?._id));
            setMessages(response.payload);
        };
        getMessages();
        //const intervalId = setInterval(getMessages, 1000); // Set a timeout every 500ms
        //return () => clearInterval(intervalId);
    }, [dispatch, currentChat, newMessage])

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

    const handleChatClick = (conversation) => {
        if (conversation === currentChat) {
            setCurrentChat(null);
        } else {
            setCurrentChat(conversation);
        }
    };



    return (
        <>
            <div className="prueba">

                <div>
                    <h1>
                        Welcome :  {data.crewcode}
                    </h1>
                    <div className="conversations">
                        <div className="conversationsTry">

                            {conversations.map((item, i) =>
                                <>

                                    <div onClick={() => handleChatClick(item)}>
                                        <div className="conversationMessenger">
                                            <Conversation conversation={item} currentUser={data._id} />

                                        </div>

                                    </div>
                                </>

                            )}

                        </div>
                        {currentChat ?
                            <div><button onClick={() => { deleteConversationChat(currentChat?._id) }} className="deleteConversation">Delete conversation</button>
                            </div>
                            : <div></div>
                        }


                    </div>

                </div>
                <div className="messenger-container">
                    <div className="current-chat">
                        <div className="chatBoxWrapper">

                            {
                                currentChat
                                    ? <>
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
                                                >
                                                </textarea>
                                                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
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