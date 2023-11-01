import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  const changeHome = () => {
    navigate("/dashboard");
  }

  return (
    <nav>
     <div className="logo" onClick={() => navigate(user ? "/dashboard" : "/")}>
        <i className="fa-solid fa-money-bill"></i> 
        <span>EXPENSE TRACKER</span>
    </div>


      <div className="nav-links">
        <ul>
          <li>
            {user ? (
               <button className="home-btn" onClick={changeHome}>
                  HOME
               </button>
            ) : (
              <a href="/">HOME</a>
            )}
          </li>
          {!user && (
            <>
              <li>
                <Link to="/about">ABOUT</Link>
              </li>
              <li>
                <a href="/contact">CONTACT</a>
              </li>
            </>
          )}
          <li>
            {user ? (
              <button className="logout-btn" onClick={handleLogout}>
                LOGOUT
              </button>
            ) : (
              <a href="/login">LOGIN</a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
