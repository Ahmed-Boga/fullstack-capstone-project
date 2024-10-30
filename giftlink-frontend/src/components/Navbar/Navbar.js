import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('auth-token');
    const name = sessionStorage.getItem('name');

    if (authToken) {
      if (isLoggedIn && name) {
        setUserName(name);
      } else {
        sessionStorage.clear(); // Clears all session data at once
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/app');
  };

  const navigateToProfile = () => {
    navigate('/app/profile');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="navbar_container">
      <a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>GiftLink</a>

      <button 
        className="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/home.html">Home</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app">Gifts</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app/search">Search</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <span 
                  className="nav-link" 
                  style={{ color: "black", cursor: "pointer" }} 
                  onClick={navigateToProfile}
                >
                  Welcome, {userName}
                </span>
              </li>
              <li className="nav-item">
                <button className="nav-link login-btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link login-btn" to="/app/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link register-btn" to="/app/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
