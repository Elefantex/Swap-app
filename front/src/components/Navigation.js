import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };
    const id = JSON.parse(localStorage.getItem('IDUserLogin'));

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid w-100">
                <Link className="navbar-brand" to="/">
                    Swap APP
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleMenuToggle}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/calendar" onClick={handleLinkClick}>
                                Calendar
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/create" onClick={handleLinkClick}>
                                Create Swap
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/calendariopropio" onClick={handleLinkClick}>
                                Self Calendar
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/createNote" onClick={handleLinkClick}>
                                Create Note
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile" onClick={handleLinkClick}>
                                Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profilenote" onClick={handleLinkClick}>
                                Profile Note
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/messenger" onClick={handleLinkClick}>
                                Messenger
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/part" onClick={handleLinkClick}>
                                Part time
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/report" onClick={handleLinkClick}>
                                Report a problem/idea
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" onClick={handleLinkClick}>
                                About
                            </Link>
                        </li>
                        {id ? (
                            <li className="nav-item">
                                <button onClick={logout} className="nav-link">
                                    <Link to="/" >Log out</Link>
                                </button>
                            </li>
                        ) : null}

                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navigation