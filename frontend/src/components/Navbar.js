import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
    const [userRole, setUserRole] = useState('');
    const [userUuid, setUserUuid] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Decode token for "Role" and "userUuid"
    useEffect(() => {
        const decodeToken = () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.role);
                    setUserUuid(decodedToken.userUuid);
                }
            } catch (error) {
                setError('Failed to decode token.');
                console.error('Error decoding token:', error);
            }
        };
        decodeToken();
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-logo">MyApp</h1>
                {error && <p className="navbar-error">{error}</p>}
                <ul className="navbar-menu">

                    <li><Link to="/">Home</Link></li>

                    {userRole === "ROLE_ADMIN" ? (
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    ) : (
                        <li>
                            <Link
                                to="/orders"
                                state={{ userUuid }}
                            >
                                My Orders
                            </Link>
                        </li>
                    )}

                    <li className="logout-button-container">
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </li>

                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
