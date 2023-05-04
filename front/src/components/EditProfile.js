import React, { useState } from "react";
import { useGetUsersByIdQuery } from "../app/apiSlice";
import { useParams } from "react-router-dom";
import { useUpdateUserMutation } from "../app/apiSlice";
import { Link } from "react-router-dom";
import { useUpdateUserPasswordMutation } from "../app/apiSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import { MdDelete, MdModeEdit } from "react-icons/md"
import { GiCancel } from "react-icons/gi"
import { TiTick } from "react-icons/ti"
import "./EditProfile.css"
import { useDeleteUserMutation } from "../app/apiSlice";
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle, Checkbox } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';





function EditProfile() {
    const id = useParams()
    console.log(id.id)
    const navigate = useNavigate()

    const { data: swapData = [] } = useGetUsersByIdQuery(id.id)
    console.log(swapData)
    const [shown2, setShown2] = useState(false)
    const switchShown2 = () => setShown2(!shown2);
    const [shown, setShown] = useState(false)
    const switchShown = () => setShown(!shown);
    const [shownOld, setShownOld] = useState(false)
    const switchShownOld = () => setShownOld(!shownOld);
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [passwordOld, setPasswordOld] = useState("")
    const id2 = localStorage.getItem("IDUserLogin")
    const id3 = JSON.parse(id2)
    const [deleteUserWarning, setDeteleteUserWarning] = useState(false)
    const [deleteUser] = useDeleteUserMutation()



    useEffect(() => {
        if (!id) {
            navigate("/")
        }
        if (id.id !== id3[0]) {
            navigate("/")
        }

    }, [])

    console.log(id.id)
    console.log(id2)
    console.log(id3[0])
    const [tipoRank, setTipoRank] = useState(swapData.rank)
    const [roster, setRoster] = useState(swapData.roster)
    const [part, setPart] = useState(swapData.part)
    const [updateUser] = useUpdateUserMutation();
    const [updatePassword] = useUpdateUserPasswordMutation()
    const [edit, setEdit] = useState(false)
    const [succes, setSucces] = useState(false)
    const [fail, setFail] = useState(false)
    const [failRoster, setFailRoster] = useState(false)



    console.log(roster)
    const updateProfile = async () => {
        if (roster > 16 || roster < 1) {
            console.log("first Update")
            setFailRoster(true)
            return
        }
        else {
            try {
                updateUser({ id: swapData._id, password: swapData.password, rank: tipoRank, roster: roster, part: part })
                //setSucces(true)
                setOpenEditProfileSucces(true);
                setTimeout(() => {
                    navigate("/profile");
                }, 3000);
            }
            catch (err) {
                console.log(err)
            }
        }

        //createUser({ email: email, password: password, crewcode: crewcode, rank: rank, part: part, roster: roster });

    }
    const editPassword = () => {

        if (password !== password2) {
            setFail(true)

            return
        }

        else {
            if (passwordOld !== swapData.password) {
                console.log("adios")
                setFail(true)
                return
            }

            else {
                updatePassword({ id: swapData._id, crewcode: swapData.crewcode, password: password })
                console.log("New pas")
                setEdit(false)
                setOpenEditProfileSucces(true);
                setFail(false)
                setFailRoster(false)
                setTimeout(() => {
                    navigate("/profile");
                }, 3000);
            }
        }

    }
    useEffect(() => {
        if (roster > 16 || roster < 1) {
            console.log("first Update")
            setFailRoster(true)

        } else {
            setFailRoster(false)

        }
    }, [roster])

    const deleteUserFunction = async (id) => {
        console.log(id)
        await deleteUser(id).unwrap();
        localStorage.clear()
        navigate("/")

    }
    const [openEditProfileSucces, setOpenEditProfileSucces] = useState(false);

    const closeEditProfileSucces = () => {
        setOpenEditProfileSucces(false);

    };
    const [openDeleteUser, setOpenDeleteUser] = useState(false);

    const closeDeleteUser = () => {
        setOpenDeleteUser(false);

    };
    const [disabledDelete, setDisabledDelete] = useState(false)
    const openDeleteUserProfile = () => {
        setOpenDeleteUser(prevState => !prevState)
        setDisabledDelete(false)
        setTimeout(() => {
            setDisabledDelete(true)
        }, 5000);
    }
    const closeFailPassword = () => {
        setFail(false)
    }

    return (
        <>
            <div className="editProfileTodo">
                <div className="datos">

                    <h1>Edit profile: {swapData.crewcode}</h1>
                    {swapData._id ? <div>

                        <div>
                            <InputLabel >Rank</InputLabel>

                            <div>
                                <Select label="Rank"
                                    onChange={(e) => setTipoRank(e.target.value)} required defaultValue={swapData.rank}>
                                    <MenuItem value="" disabled>Select Rank</MenuItem>
                                    <MenuItem value="JU">JU</MenuItem>
                                    <MenuItem value="JUPU">JUPU</MenuItem>
                                    <MenuItem value="PU">PU</MenuItem>
                                </Select>

                            </div>

                        </div>

                        <div>

                            <div style={{ margin: "10px 0px 0px 0px" }}>
                                <TextField id="outlined-basic"
                                    variant="outlined" required type="number"
                                    inputProps={{ max: 16, min: 1 }}
                                    onChange={(e) => setRoster(e.target.value)}
                                    value={roster}
                                    defaultValue={swapData.roster}
                                    label="Roster"
                                    error={roster <= 0 || roster > 16 ? true : false}
                                    helperText={roster <= 0 || roster > 16 ? "Must be between 1-16" : ""}
                                    style={{ width: '20ch' }}
                                />

                            </div>

                        </div>
                        <div style={{ margin: "10px 0px 10px 0px" }}>
                            <label htmlFor="part-time">
                                <InputLabel >Looking for part time:
                                    <Checkbox
                                        type="checkbox"
                                        name=""
                                        id="part-time"
                                        defaultValue={part === true ? true : false}
                                        checked={part}
                                        onChange={(e) => setPart(e.target.checked)}
                                    />
                                </InputLabel>
                            </label>
                        </div>


                    </div> : <div>Loading</div>}


                    <div className="editBottom">
                        <div className="swapTipoButton">
                            <Button variant="contained" className="editProfileButton" endIcon={<MdModeEdit />}
                                style={{ backgroundColor: 'green' }}
                                onClick={updateProfile}
                            >
                                Update profile
                            </Button>
                        </div>
                        <div>
                            {succes
                                ? <div>

                                    <Alert severity="success">
                                        <AlertTitle>Succcess</AlertTitle>
                                        Info changed correctly, redirecting to your profile
                                        <PuffLoader
                                            color="#000000"
                                            loading="true"
                                            size={30}
                                            speedMultiplier="0.8"
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </Alert>

                                </div>
                                : <div></div>}
                        </div>
                        <div>
                            <Button className="editProfileButton" onClick={() => { setEdit((prevState => !prevState)); setSucces(false); setPassword(""); setPassword2(""); setPasswordOld(""); setFail(false) }} endIcon={<MdModeEdit />} style={{ backgroundColor: 'orange', margin: "10px 0px 10px 0px" }}
                            >Edit password</Button>
                        </div>
                        <div>
                            {edit
                                ? <>

                                    <div>
                                        <div>
                                            <InputLabel >Old password:</InputLabel>
                                        </div>
                                        <div>
                                            <TextField
                                                type={shownOld ? 'text' : 'password'}
                                                value={passwordOld}
                                                placeholder="Old password"
                                                onChange={(e) => {
                                                    setPasswordOld(e.target.value);
                                                    setFail(false);
                                                }}
                                                required />
                                            <Button onClick={switchShownOld} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel >New password:</InputLabel>
                                    </div>
                                    <div>
                                        <TextField
                                            type={shown ? 'text' : 'password'}
                                            value={password}
                                            placeholder="New password"
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setFail(false);
                                            }}
                                            required />
                                        <Button onClick={switchShown} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>
                                    </div>
                                    <div>
                                        <InputLabel >Repeat New Password:</InputLabel>
                                    </div>
                                    <div>
                                        <TextField
                                            type={shown2 ? 'text' : 'password'}
                                            value={password2}
                                            placeholder="Repeat New password"
                                            onChange={(e) => {
                                                setPassword2(e.target.value);
                                                setFail(false);
                                            }}
                                            required />
                                        <Button onClick={switchShown2} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>
                                    </div>
                                    <Button variant="contained" className="editPasswordProfileButton" onClick={editPassword} endIcon={<TiTick />} style={{ backgroundColor: 'green', margin: "10px 0px 10px 0px" }}
                                    >Edit password</Button>

                                </>
                                : <div>
                                </div>}
                        </div>

                        
                        <div>


                            <Button variant="contained" className="editProfileButton" endIcon={<GiCancel />} style={{ backgroundColor: 'gray', margin: "10px 0px 10px 0px" }}
                            ><Link to={"/profile"}>
                                    Cancel
                                </Link></Button>
                        </div>
                        <div>
                            <div>
                                <Button variant="outlined" className="deleteProfile" onClick={openDeleteUserProfile}
                                    endIcon={<MdDelete />} color="error">
                                    Delete User</Button>
                                <Dialog
                                    open={openDeleteUser}
                                    onClose={closeDeleteUser}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {"Delete user"}
                                    </DialogTitle>
                                    <DialogContent>
                                        <div id="alert-dialog-description">
                                            Deleting your user can not be undone, it will erase all your information
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={closeDeleteUser} style={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 10,
                                        }}
                                            color="success"
                                            variant="contained"
                                        >Cancel</Button>
                                        <Button
                                            onClick={() => deleteUserFunction(swapData._id)} endIcon={<MdDelete />}
                                            //onClick={handleClose}
                                            disabled={disabledDelete ? false : true}
                                            autoFocus
                                            color="error"
                                            variant="contained">
                                            {disabledDelete ? "Delete User" : "Wait 5 seconds"}

                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </div>
                        </div>

                    </div >
                    <Dialog
                        disableEscapeKeyDown
                        open={openEditProfileSucces}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Info changed it correctly"}
                        </DialogTitle>
                        <DialogContent>
                            <div id="alert-dialog-description">
                                Info changed correctly, redirecting to your profile
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <PuffLoader
                                color="#000000"
                                loading="true"
                                size={30}
                                speedMultiplier="0.8"
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />

                        </DialogActions>
                    </Dialog>
                    <div>

                        <Dialog
                            onClose={closeFailPassword}
                            open={fail}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Error"}
                            </DialogTitle>
                            <DialogContent>
                                <div id="alert-dialog-description">
                                    Password does not match or incorrect password
                                </div>
                            </DialogContent>
                            <DialogActions>


                                <Button
                                    onClick={closeFailPassword}
                                    //onClick={handleClose}
                                    autoFocus
                                    color="error"
                                    variant="contained">
                                    Ok
                                </Button>


                            </DialogActions>

                        </Dialog>
                    </div>

                </div>


            </div >

        </>
    )
}

export default EditProfile