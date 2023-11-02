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

  return (
    <nav>
      <div className="logo" onClick={() => navigate(user ? "/dashboard" : "/")}>
        <i className="fa-solid fa-money-bill"></i>
        <span>EXPENSE TRACKER</span>
      </div>
      <div className="nav-links">
        <ul>
          <li>
            <Link to={user ? "/dashboard" : "/"}>HOME</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/about">ABOUT</Link>
              </li>
              <li>
                <Link to="/contact">CONTACT</Link>
              </li>
            </>
          )}
          <li>
            {user ? (
              <button className="logout-btn" onClick={handleLogout}>
                LOGOUT
              </button>
            ) : (
              <Link to="/login">LOGIN</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
