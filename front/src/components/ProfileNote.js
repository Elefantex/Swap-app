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




function ProfileNote() {

    const id = JSON.parse(localStorage.getItem('IDUserLogin'));
    const dispatch = useDispatch()
    const { data: swapData = [] } = useGetUsersByIdQuery(id)
    console.log(swapData.part)
    console.log(swapData._id)
    const navigate = useNavigate()


    const [fetchData, setFetchData] = useState([])
    const [deleteSwap] = useDeleteSwapMutation()
    const [deleteUser] = useDeleteUserMutation()
    const [freshSwaps, setFreshSwaps] = useState([]);
    const [expiredSwaps, setExpiredSwaps] = useState([]);
    const [swaps, setSwaps] = useState(true)
    console.log("first")
    const [isLoading, setIsLoading] = useState(false);


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
            console.log(data);
            data.sort((a, b) => new Date(a.date) - new Date(b.date));

            setFetchData(data.filter(swap => swap.userId === swapData._id));
            setIsLoading(false);
        }
        fetchSwapsInfo();
    }, [swapData._id]);


    useEffect(() => {
        // filter the swaps/offers that are expired
        const now = new Date();
        const expired = fetchData.filter(item => new Date(item.date) < now && item.date !== new Date().toISOString().slice(0, 10));
        setExpiredSwaps(expired);
        // filter the swaps/offers that are not expired
        const fresh = fetchData.filter(item => new Date(item.date) >= now || item.date === new Date().toISOString().slice(0, 10));
        setFreshSwaps(fresh);

    }, [fetchData]);

    const deleteSwapFunction = async (id) => {
        console.log(id)
        await deleteSwap({ id }).unwrap();
        if (swaps) {
            setFreshSwaps((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));

        } else {
            setExpiredSwaps((prevSwaps) => prevSwaps.filter((swap) => swap._id !== id));
        }
    }
    const deleteUserFunction = async (id) => {
        console.log(id)
        await deleteUser(id).unwrap();
        localStorage.clear()
        navigate("/")

    }

    const [deleteUserWarning, setDeteleteUserWarning] = useState(false)


    return (

        <>
            <div className="profileTodos">
                <div className="profileTipo">
                    <h2>
                        Welcome: {swapData.crewcode}
                    </h2>

                    <div className="swapTipoButton">
                        <button className="editProfileButton">
                            <Link to={swapData._id}>
                                Edit profile <MdModeEdit />
                            </Link>
                        </button>
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
                        <button disabled className="buttonProfile">Fresh</button>
                        <button onClick={() => setSwaps(false)} className="buttonProfile">Expired</button>

                        <div >


                            {
                                freshSwaps.length > 0 ?
                                    < div > <b>Swaps / Offer day off:</b>{freshSwaps.map((item) => {
                                        return (
                                            <>
                                                <div className="swapProfile">
                                                    <div className="swapTipo">
                                                        <b>{item.tipoSwap}</b>
                                                        <div className="swapTipoButton">
                                                            <button onClick={() => { deleteSwapFunction(item._id) }} className="buttonDeleteSwap">Delete Swap <TiDelete />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="swapItem">
                                                        Date: {item.date}
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
                                    : <div><b>No Swaps</b>

                                    </div>
                            }
                        </div>
                    </>
                    : <>
                        <button onClick={() => setSwaps(true)} className="buttonProfile">Fresh</button>
                        <button disabled className="buttonProfile">Expired</button>
                        {
                            expiredSwaps.length > 0 ?
                                <div><b>Swaps/Offer day off:</b>{expiredSwaps.map((item) => {
                                    return (
                                        <>
                                            <div className="swapProfile">

                                                <div className="swapTipo">
                                                    <b>{item.tipoSwap}</b>
                                                    <div className="swapTipoButton">
                                                        <button onClick={() => { deleteSwapFunction(item._id) }} className="buttonDeleteSwap">Delete Swap <TiDelete />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="swapItem">
                                                    Date: {item.date}
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

            <div>
                <button onClick={() => setDeteleteUserWarning(true)} className="deleteProfile"><MdDelete />Delete User</button>
                {deleteUserWarning
                    ?
                    <div><button onClick={() => { deleteUserFunction(swapData._id) }} className="deleteProfileSure"><MdDelete />¿Sure?<MdDelete /></button></div>
                    : <div></div>}



            </div>


        </>
    )
}

export default ProfileNote