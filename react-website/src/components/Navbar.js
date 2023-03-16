import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <a href="/">Hjem</a>
                </li>
                <li>
                    <a href="/">Møtetid i morgen</a>
                </li>
                <li>
                    <a href="/">Standard Møtetid</a>
                </li>
                <li>
                    <a href="/">Regler</a>
                </li>
                <li>
                    <a href="/">Registrer en bruker</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
