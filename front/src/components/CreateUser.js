import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { fetchUsersLogin, fetchUsersLoginRecover } from "../app/slices";
import { useUpdateUserPasswordMutation } from "../app/apiSlice";
import "./CreateUser.css"
import { createUSer } from "../app/slices";
import { Button, TextField, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";
import { getUsersLoginRecover, getPasswordChangeCreate } from "../app/slices";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PuffLoader from "react-spinners/ClipLoader";





const CreateUser = () => {
    const id = localStorage.getItem("IDUserLogin")

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [updatePassword] = useUpdateUserPasswordMutation()
    const [failRoster, setFailRoster] = useState(false)



    const [shown2, setShown2] = useState(false)

    const switchShown2 = () => setShown2(!shown2);
    const [shown3, setShown3] = useState(false)

    const switchShown3 = () => setShown3(!shown3);
    //const [createUser] = useCreateUserMutation();

    const [succes, setSucces] = useState(false)
    const [isLoading, setIsLoading] = useState(false);



    const [recoverSucces, setRecoverSucces] = useState(false)

    const [registro, setRegistro] = useState(false);
    const [recover, setRecover] = useState(false)

    const [differentPassword, setDifferentPassword] = useState(false)
    const [crewcode, setCrewcode] = useState("");
    const [differentLogin, setDifferentLogin] = useState(true)
    const [rank, setTipoRank] = useState("")
    const [rankRecover, setTipoRankRecover] = useState("")

    const [failCrewcode, setFailCrewcode] = useState(false)
    const RankUser = localStorage.getItem('IDUserLogin');

    const [email, setEmail] = useState("")
    const [emailRecover, setEmailRecover] = useState("")

    const [password, setPassword] = useState("")
    const [passwordNew, setPasswordNew] = useState("")

    const [password2, setPassword2] = useState("")
    const [passwordNew2, setPasswordNew2] = useState("")


    const [crewcodeLogin, setCrewCodeLogin] = useState("")
    const [crewcodeRecover, setCrewCodeRecover] = useState("")

    const [passwordLogin, setPasswordLogin] = useState("")
    //console.log(users)
    const [roster, setRoster] = useState(1)
    const part = false
    const [errorRegister, setErrorRegister] = useState(false)
    const [recoverSuccesFail, setRecoverSuccesFail] = useState(false)
    const [recoverPasswordFail, setRecoverPasswordFail] = useState(false)

    useEffect(() => {
        if (id) {
            navigate("/home")
        }
    }, [])
    const [invalidEmail, setInvalidEmail] = useState(false)
    const addUser = async (e) => {
        e.preventDefault();
        setErrorRegister(false)
        setDifferentPassword(false)
        setFailCrewcode(false)
        setInvalidEmail(false)
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setInvalidEmail(true)
            console.log("Invalid email address");
            return;
        }
        if (password !== password2) {
            console.log("Password does not match")
            setDifferentPassword(true)
            return
        } else if (crewcode.length !== 6) {
            setFailCrewcode(true)
            return
        } else if (roster > 16 || roster < 1) {
            console.log("first Update")
            setFailRoster(true)
            return
        }
        else if (password.length < 6 || password2.length < 6) {
            setErrorRegister(true)
            return
        }
        else {
            try {
                const userData = { email, password, crewcode, rank, part, roster };
                await createUSer(userData);
                setEmail("");
                setPassword("");
                setPassword2("");
                setCrewcode("");
                setRegistro(false);
                setCrewCodeLogin(crewcode)
                setPasswordLogin(password)
                console.log("User was created successfully!");
                dispatch(fetchUsersLogin({ crewcode: crewcode, password: password }))
            } catch (err) {
                console.log("error en user")
                console.log(err);
                setFailCrewcode(true);
                setRegistro(true);
                setErrorRegister(true)

            }
        }
    };
    useEffect(() => {
        if (roster > 16 || roster < 1) {
            console.log("first Update")
            setFailRoster(true)

        } else {
            setFailRoster(false)

        }
    }, [roster])

    const loginDatabase = () => {
        setIsLoading(true)

        dispatch(fetchUsersLogin({ crewcode: crewcodeLogin, password: passwordLogin }))
            .then((response) => {
                try {
                    console.log("etIsLoading(true)")

                    const userFilter = response.payload.user;
                    if (userFilter.password === passwordLogin) {
                        setDifferentLogin(true);
                        console.log("Encontrado usuario y todo");
                        console.log(userFilter._id);
                        const storeIdLocalStorage = [userFilter._id];
                        const storeRankLocalStorage = userFilter.rank;
                        const storeRosterLocalStorage = userFilter.roster;

                        localStorage.setItem("IDUserLogin", JSON.stringify(storeIdLocalStorage));
                        localStorage.setItem("Rank", JSON.stringify(storeRankLocalStorage));
                        localStorage.setItem("Roster", JSON.stringify(storeRosterLocalStorage));

                        navigate("/home");
                    } else {
                        setDifferentLogin(false);
                        console.log("password no encontrada");
                    }
                } catch (error) {
                    setDifferentLogin(false);
                    console.log("Error not found");
                    setIsLoading(false);

                }
            })
            .catch((error) => {
                setDifferentLogin(false);
                setIsLoading(false);
                console.log("Nada encontrado");
            });
    };
    const [idRecover, setIdRecover] = useState("")
    const [crewcodeLoginRecover, setCrewcodeLoginRecover] = useState("")
    const [errorRecover, setErrorRecover] = useState("")
    const recoverPassword = async () => {
        setIdRecover("")
        try {
            console.log("first")
            const response = await getUsersLoginRecover({ crewcode: crewcodeRecover, rank: rankRecover, email: emailRecover });
            console.log(response.user)
            setRecoverSucces(true)
            setIdRecover(response.user._id)
            setCrewcodeLoginRecover(response.crewcode)
            setErrorRecover(false)


        } catch (error) {
            console.error(error);
            setRecoverSucces(false)
            setErrorRecover(true)

        }
    }

    const [openEditPasswordSucces, setOpenEditPasswordSucces] = useState(false)

    const [editPasswordSucces, setEditPasswordSucces] = useState(false)
    const editPassword = async () => {

        if (passwordNew !== passwordNew2) {
            setRecoverPasswordFail(true)
            setEditPasswordSucces(true)
            return
        }

        else {
            try {
                const response = await getPasswordChangeCreate({ _id: idRecover, password: passwordNew });
                console.log(response)
                setOpenEditPasswordSucces(true)
                setRecover(false)
                setRecoverSucces(false)
                setCrewCodeRecover("")
                setPasswordNew("")
                setPasswordNew2("")
                setEmailRecover("")
                setTipoRankRecover("")
                setEditPasswordSucces(false)
                setTimeout(() => {
                    setOpenEditPasswordSucces(false)
                }, 3000);
            }
            catch (err) {
                console.error(err);
                setEditPasswordSucces(true)
            }
            //setEdit(false)
            //setSucces(true)
            //setFail(false)

        }

    }



    const handleInputChange = (event) => {
        const value = event.target.value.replace(/[^A-Za-z]/g, ""); // remove non-letter characters
        setCrewcode(value.toUpperCase()); // convert to uppercase
    };
    const handleInputChange2 = (event) => {
        const value = event.target.value.replace(/[^A-Za-z]/g, ""); // remove non-letter characters
        setCrewCodeLogin(value.toUpperCase()); // convert to uppercase
    };
    const handleInputChange3 = (event) => {
        const value = event.target.value.replace(/[^A-Za-z]/g, ""); // remove non-letter characters
        setCrewCodeRecover(value.toUpperCase()); // convert to uppercase
    };
    const changeRegistro = () => {
        setRegistro(true)
        setCrewcode("")
        setCrewCodeLogin("")
        setCrewCodeRecover("")
        setEmail("")
        setPassword("")
        setPassword2("")
        setTipoRank("")
        setPasswordLogin("")
        setRecoverSucces(false)
        setRecover(false)
        setTipoRankRecover("")
        setEmailRecover("")
        setPasswordNew("")
        setPasswordNew2("")
        setErrorRegister(false)
        setDifferentPassword(false)
        setDifferentLogin(true)
        setInvalidEmail(false)


    }
    const changeLogin = () => {
        setRegistro(false)
        setCrewcode("")
        setCrewCodeLogin("")
        setCrewCodeRecover("")
        setEmail("")
        setPassword("")
        setPassword2("")
        setTipoRank("")
        setPasswordLogin("")
        setRecoverSucces(false)
        setRecover(false)
        setTipoRankRecover("")
        setEmailRecover("")
        setPasswordNew("")
        setPasswordNew2("")
        setErrorRegister(false)
        setDifferentPassword(false)
        setDifferentLogin(true)
        setInvalidEmail(false)

    }
    let [color, setColor] = useState("#000000");


    return (

        <div className="profileTodos">
            <div className="datos">

                {registro ? (
                    <div>
                        <div>
                            <Button variant="outlined" className="buttonProfile" onClick={changeLogin}>
                                Login</Button>
                            <Button variant="contained" className="buttonProfile" onClick={changeRegistro}
                                style={{ backgroundColor: '#26C3FF' }}
                            >Register</Button>
                        </div>
                        <div>
                            <div>
                                <InputLabel >Crewcode:</InputLabel>
                            </div>
                            <TextField id="outlined-basic" variant="outlined"
                                inputProps={{ maxLength: 6 }}
                                type="text"
                                value={crewcode}
                                placeholder="Crewcode"
                                onChange={handleInputChange}
                                maxLength="6"

                                error={crewcode.length !== 6 && crewcode.length !== 0 ? true : false}
                                helperText={crewcode.length !== 6 && crewcode.length !== 0 ? "Has to be 6 characters" : ""}
                                required
                            />

                            <div>
                                <InputLabel >Email:</InputLabel>
                            </div>
                            <TextField
                                required
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                inputProps={{ type: "email" }}
                                type="email"
                                error={invalidEmail}
                                helperText={
                                    invalidEmail
                                        ? "This is not an email"
                                        : ""
                                }
                            />

                            <div>
                                <InputLabel >Password:</InputLabel>
                            </div>
                            <div>
                                <TextField
                                    type={shown2 ? 'text' : 'password'}
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={password.length < 6 && password.length !== 0}
                                    helperText={
                                        password.length < 6 && password.length !== 0
                                            ? "Password too short"
                                            : ""
                                    }
                                    inputProps={{
                                        minLength: 6,
                                    }}
                                    required />
                                <Button onClick={switchShown2} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>
                            </div>
                            <div>
                                <InputLabel >Repeat Password:</InputLabel>
                            </div>
                            <div>
                                <TextField
                                    type={shown2 ? 'text' : 'password'}
                                    value={password2}
                                    placeholder="Password"
                                    onChange={(e) => setPassword2(e.target.value)}
                                    error={password2.length < 6 && password2.length !== 0}
                                    helperText={
                                        password2.length < 6 && password2.length !== 0
                                            ? "Password too short"
                                            : ""
                                    }
                                    inputProps={{
                                        minLength: 6,
                                    }}

                                />
                                <Button onClick={switchShown2} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>


                            </div>
                            <div>
                                <div>
                                    <InputLabel >Rank</InputLabel>

                                    <Select label="Rank"
                                        value={rank} onChange={(e) => setTipoRank(e.target.value)} required>
                                        <MenuItem value="" disabled>Select Rank</MenuItem>
                                        <MenuItem value="JU">JU</MenuItem>
                                        <MenuItem value="JUPU">JUPU</MenuItem>
                                        <MenuItem value="PU">PU</MenuItem>
                                    </Select>
                                </div>

                            </div>
                            <div style={{ margin: "10px 0px 0px 0px" }}>
                                <TextField id="outlined-basic"
                                    variant="outlined" required type="number"
                                    inputProps={{ max: 16, min: 1 }}
                                    onChange={(e) => setRoster(e.target.value)}
                                    value={roster}
                                    error={roster > 16 || roster < 1}

                                    helperText={
                                        roster > 16 || roster < 1
                                            ? "Roster has to be between 1 and 16"
                                            : ""
                                    }
                                    label="Roster"
                                />


                            </div>
                            <div style={{ margin: "10px 0px 0px 0px" }}>
                                <Button variant="contained" onClick={addUser} style={{ backgroundColor: '#083466' }}>Sign up</Button>

                            </div>
                        </div>
                        {differentPassword ? <div>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Password does not match
                            </Alert>

                        </div> : <div></div>}
                        {errorRegister ? <div>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Error in any field or Crewcode is on use
                            </Alert>
                        </div> : <div></div>}

                        {failRoster ? <div>
                            <Alert severity="warning">
                                <AlertTitle>Error</AlertTitle>
                                Roster has to be between 1 and 16
                            </Alert>
                        </div> : <div></div>}

                    </div>
                ) : (
                    <div>
                        <div>
                            <Button variant="contained" className="buttonProfile" onClick={changeLogin}
                                style={{ backgroundColor: '#26C3FF' }}

                            >Login </Button>
                            <Button variant="outlined" className="buttonProfile" onClick={changeRegistro}>Register</Button>
                            <PuffLoader
                                color={color}
                                loading={isLoading}
                                size={30}
                                speedMultiplier="0.8"
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />

                            <div>
                                <InputLabel >Crewcode:</InputLabel>

                            </div>
                            <TextField id="outlined-basic" variant="outlined"
                                inputProps={{ maxLength: 6 }}
                                type="text"
                                value={crewcodeLogin}
                                placeholder="Crewcode"
                                onChange={handleInputChange2}
                                maxLength="6"

                                required
                            />
                        </div>
                        <div>
                            <InputLabel >Password:</InputLabel>

                        </div>
                        <TextField
                            type={shown2 ? 'text' : 'password'}
                            value={passwordLogin}
                            placeholder="Password"
                            onChange={(e) => setPasswordLogin(e.target.value)}

                            required
                        />
                        <Button onClick={switchShown2} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>



                        <div style={{ margin: "10px 0px 10px 0px" }}>
                            <Button variant="contained" onClick={loginDatabase} className="buttonProfile"
                                style={{ backgroundColor: '#083466' }}
                            >
                                Sign in
                            </Button>
                        </div>
                        <div>
                            <Button variant="contained" color="success" onClick={() => {
                                setRecoverSucces(false);
                                setRecover(prevState => !prevState);
                            }} className="buttonProfile">Recover password</Button>

                        </div>
                        {recover
                            ? <div>
                                <div>
                                    <InputLabel >CrewCode:</InputLabel>
                                </div>
                                <TextField id="outlined-basic" variant="outlined"
                                    inputProps={{ maxLength: 6 }}
                                    type="text"
                                    value={crewcodeRecover}
                                    placeholder="Crewcode"
                                    onChange={handleInputChange3}
                                    maxLength="6"

                                    required
                                />
                                <div>
                                    <InputLabel >Rank</InputLabel>
                                    <Select
                                        label="Rank"
                                        value={rankRecover} onChange={(e) => setTipoRankRecover(e.target.value)} required>
                                        <MenuItem value="" disabled>Select Rank</MenuItem>
                                        <MenuItem value="JU">JU</MenuItem>
                                        <MenuItem value="JUPU">JUPU</MenuItem>
                                        <MenuItem value="PU">PU</MenuItem>
                                    </Select>

                                </div>
                                <div>
                                    <InputLabel >Email:</InputLabel>
                                </div>
                                <TextField id="outlined-basic" variant="outlined"
                                    type="text"
                                    value={emailRecover}
                                    inputProps={{ type: "email" }}
                                    placeholder="Email"
                                    onChange={(e) => setEmailRecover(e.target.value)}
                                    error={errorRecover ? true : false}
                                    helperText={errorRecover ? "Error in any field" : ""}
                                    required
                                />
                                <div>
                                    <Button variant="contained" color="success" onClick={recoverPassword} className="buttonProfile">Recover</Button>

                                </div>
                                {recoverSucces ? <div>
                                    <div>
                                        <InputLabel >New password:</InputLabel>
                                    </div>
                                    <div>
                                        <TextField
                                            type={shown3 ? 'text' : 'password'}
                                            value={passwordNew}
                                            placeholder="Password"
                                            onChange={(e) => setPasswordNew(e.target.value)}
                                            error={editPasswordSucces && passwordNew.length < 6}
                                            helperText={
                                                editPasswordSucces && passwordNew.length < 6
                                                    ? "Passwords do not match or too short"
                                                    : ""
                                            }
                                            inputProps={{
                                                minLength: 6,
                                            }}

                                            required
                                        />
                                        <Button onClick={switchShown3} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>
                                    </div>
                                    <div>
                                        <InputLabel >Repeat new password:</InputLabel>
                                    </div>
                                    <div>
                                        <TextField
                                            type={shown3 ? 'text' : 'password'}
                                            value={passwordNew2}
                                            placeholder="Password"
                                            onChange={(e) => setPasswordNew2(e.target.value)}
                                            error={editPasswordSucces && passwordNew2.length < 6}
                                            helperText={
                                                editPasswordSucces && passwordNew2.length < 6
                                                    ? "Passwords do not match or too short"
                                                    : ""
                                            }
                                            inputProps={{
                                                minLength: 6,
                                            }}
                                            required
                                        />
                                        <Button onClick={switchShown3} variant="text" style={{ margin: "10px 0px 0px 10px" }}>Show</Button>

                                    </div>
                                    <Button variant="contained" color="success" onClick={editPassword} className="buttonProfile">Edit password</Button>

                                </div> : <div>{recoverSuccesFail
                                    ? <div>
                                        <Alert severity="error">
                                            <AlertTitle>Error</AlertTitle>
                                            Incorrect info
                                        </Alert>
                                    </div>
                                    : <div></div>}</div>}

                            </div>
                            : <div></div>}
                        {differentLogin ? <div></div> : <div>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Incorrect Crewcode/password
                            </Alert>
                        </div>}
                        {succes
                            ? <div>
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    Password changed it correctly
                                </Alert>
                            </div>
                            : <div></div>}
                    </div>
                )}
                <Dialog
                    disableEscapeKeyDown
                    open={openEditPasswordSucces}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Info changed it correctly"}
                    </DialogTitle>
                    <DialogContent>
                        <div id="alert-dialog-description">
                            Info changed correctly, redirecting
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
            </div>

        </div>

    );
};
export default CreateUser;
