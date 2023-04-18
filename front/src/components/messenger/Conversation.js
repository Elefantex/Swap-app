import React, { useEffect, useState } from "react";
import { useGetUsersByIdQuery } from "../../app/apiSlice";

function Conversation({ conversation, currentUser }) {


    console.log(conversation)
    console.log(currentUser)

    const friendId = conversation.members.find(m => m !== currentUser)
    console.log(friendId)

    const { data: data = [] } = useGetUsersByIdQuery(friendId)
    console.log(data)

  


    return (
        <>

            <p>
                <div>
                    Chat with {data.crewcode}
                
                </div>
            </p>

        </>
    )
}

export default Conversation