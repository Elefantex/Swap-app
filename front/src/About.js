import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';



function About() {


    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div>
                <p>
                    For any query related or info contact :
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Open alert dialog
                    </Button>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Use Google's location service?"}
                        </DialogTitle>
                        <DialogContent>
                            <div id="alert-dialog-description">
                                Let Google help apps determine location. This means sending anonymous
                                location data to Google, even when no apps are running.
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                            }}>Disagree</Button>
                            <Button onClick={handleClose} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>

                </p>
            </div>

        </>
    )
}
export default About