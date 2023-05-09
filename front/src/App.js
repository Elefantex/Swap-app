import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from './About';
import './App.css';
import Calendario from './Calendario';
import CalendarioPropio from './CalendarioPropio';
import HomeScreen from './HomeSceen';
import CreateNote from './components/CreateNote.js';
import CreateSwap from './components/CreateSwap';
import CreateUser from './components/CreateUser';
import EditProfile from "./components/EditProfile.js";
import InfoNote from './components/InfoNote';
import InfoSwap from './components/InfoSwap';
import Navigation from './components/Navigation';
import PartFinder from './components/PartFinder';
import Profile from './components/Profile';
import Report from './components/Report';
import Messenger from './components/messenger/Messenger';

function App() {
    return (
        <Router>
            <Navigation />

            <div className="moviles">
                <Routes>

                    <Route path="/calendar" element={<Calendario />} />
                    <Route path="/create" element={<CreateSwap />} />
                    <Route path='/createNote' element={<CreateNote />} />
                    <Route path="/swap/:cellDate" element={<InfoSwap />} />
                    <Route path="/note/:cellDate" element={<InfoNote />} />
                    <Route path="/" element={<CreateUser />} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path='/profile/:id' element={<EditProfile />} />
                    <Route path="/messenger" element={<Messenger />} />
                    <Route path="/part" element={<PartFinder />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/calendarioPropio" element={<CalendarioPropio />} />
                    <Route path="/home" element={<HomeScreen/>}/>
                    

                </Routes>

            </div>
        </Router>

    )
}
export default App