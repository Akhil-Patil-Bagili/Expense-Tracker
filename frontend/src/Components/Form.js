import React, { useState, useContext } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function Form({ showNameField, setShowNameField, setTitle }) {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { username, email, password } = formData;
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(null); // Reset the error state whenever there's a change in input
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User signed up successfully! You can now log in.");
        setFormData({ username: "", email: "", password: "" });
        setShowNameField(false);
        setTitle("Sign In");
      } else {
        const data = await response.json();
        setError(`Failed to sign up. Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to sign up. Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        setUser(username);
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(`Failed to sign in.   Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={showNameField ? handleSignUp : handleSignIn}>
        <div className="input-group">
          <div className="input-field">
            <FaUser />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>

          {showNameField && (
            <div className="input-field">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="input-field">
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="btn-field" style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">
            {showNameField ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>

      <div className="btn-field" style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <button 
          type="button" 
          onClick={() => { setShowNameField(true); setTitle("Sign Up"); }}
          className={showNameField ? "active" : "disable"} 
          style={{ marginRight: "10px" }}
        >
          Sign Up
        </button>
        <button 
          type="button" 
          onClick={() => { setShowNameField(false); setTitle("Sign In"); }}
          className={!showNameField ? "active" : "disable"}
        >
          Sign In
        </button>
      </div>
    </>
  );
}

export default Form;