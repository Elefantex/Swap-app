import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Test from './Test';
import Navigation from './components/Navigation'
import CreateSwap from './components/CreateSwap';
import CreateNote from './components/CreateNote.js';
import InfoSwap from './components/InfoSwap';
import CreateUser from './components/CreateUser';
import EditProfile from "./components/EditProfile.js"
import Messenger from './components/messenger/Messenger';
import PartFinder from './components/PartFinder';
import About from './About';
import Report from './components/Report';
import CalendarioPropio from './CalendarioPropio';
import InfoNote from './components/InfoNote';
import HomeScreen from './HomeSceen';
import Profile2 from './components/Profile copy';

function App() {
    return (
        <Router>
            <Navigation />

            <div className="moviles">
                <Routes>

                    <Route path="/calendar" element={<Test />} />
                    <Route path="/create" element={<CreateSwap />} />
                    <Route path='/createNote' element={<CreateNote />} />
                    <Route path="/swap/:cellDate" element={<InfoSwap />} />
                    <Route path="/note/:cellDate" element={<InfoNote />} />
                    <Route path="/" element={<CreateUser />} />
                    <Route path="/profile" element={<Profile2 />} />
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