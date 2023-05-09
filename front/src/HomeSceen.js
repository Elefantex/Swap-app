import React from "react";

import { useEffect } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { BsCalendarEvent, BsCalendarRange, BsClockHistory } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { RiStickyNoteLine } from "react-icons/ri";
import { TbBrandMessenger } from "react-icons/tb";
import { VscReport } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

import { Link } from "react-router-dom";


function HomeScreen() {
    const id = JSON.parse(localStorage.getItem('IDUserLogin'));
    const navigate = useNavigate()
    useEffect(() => {
        if (!id) {
          navigate("/")
        }
      }, [])

    const logout = () => {
        localStorage.clear()
        window.location.href = "/";
    }
    return (
        <>
            <div className="parent">
                <Link to="/calendar">
                    <div className="casillaHome">
                        <div className="iconoHome">
                            <BsCalendarEvent size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Swap Calendar
                        </div>

                    </div>
                </Link>
                <Link to="/calendariopropio">
                    <div className="casillaHome">
                        <div className="iconoHome">
                            <BsCalendarRange size={"5em"} />
                        </div>
                        <div className="textoHome">
                            My Calendar
                        </div>

                    </div>
                </Link>

                <Link to="/profile">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <CgProfile size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Profile
                        </div>


                    </div>
                </Link>

                <Link to="/create">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <AiOutlineSwap size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Create Swap
                        </div>


                    </div>
                </Link>

                <Link to="/createNote">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <RiStickyNoteLine size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Create Note
                        </div>


                    </div>
                </Link>

                <Link to="/part">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <BsClockHistory size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Part Time
                        </div>


                    </div>
                </Link>

                <Link to="/report">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <VscReport size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Report/Request
                        </div>


                    </div>
                </Link>

                <Link to="/messenger">

                    <div className="casillaHome">
                        <div className="iconoHome">
                            <TbBrandMessenger size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Messenger
                        </div>


                    </div>
                </Link>

                    <div className="casillaHome" onClick={logout}>
                        <div className="iconoHome">
                            <BiLogOut size={"5em"} />
                        </div>
                        <div className="textoHome">
                            Log out
                        </div>


                    </div>

            </div >
        </>
    )
}

export default HomeScreen