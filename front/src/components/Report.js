import React from "react";
import { useState } from "react";
import { createRequestSlice } from "../app/slices";
import { useCreateRequestMutation } from "../app/apiSlice";
import { useDispatch } from "react-redux";
import PuffLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

function Report() {

    const [text, setText] = useState("")
    const [minLength, setMinLength] = useState(false)
    const [request] = useCreateRequestMutation()
    const [succes, setSucces] = useState(false)
    const navigate = useNavigate()
    const sendReport = async () => {
        console.log(text)
        if (text.length < 10) {
            setMinLength(true)
            return
        }
        else {
            try {
                const userData = { text };
                await request({ requestMessage: text });
                setText("")
                setSucces(true)
                setMinLength(false)
                setTimeout(() => {
                    navigate("/");
                }, 3000);

            }
            catch (err) {
                console.log(err)

            }
        }

    }
    return (
        <>
            <div className="profileTodos">
                <div className="datos">
                    Report any problem or suggestion to:

                    <div>
                        <textarea name="" id="" cols="30" rows="10"
                            style={{ width: "85%", margin: "5px" }}
                            value={text}
                            onInput={e => setText(e.target.value)}
                            placeholder="Write a problem or suggestion to add"
                        ></textarea>
                        <div>
                            {text.length}/500
                        </div>
                        <div>
                            <button onClick={sendReport}>Send</button>
                        </div>
                    </div>
                    {minLength ?
                        <div>
                            The message has to be at least 10 characters
                        </div> :
                        <div>
                        </div>}
                    {succes
                        ? <div>Message sent successfully,redirecting
                            <PuffLoader
                                color="#000000"
                                loading="true"
                                size={30}
                                speedMultiplier="0.8"
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                        : <div></div>}
                </div>
            </div>
        </>
    )
}
export default Report