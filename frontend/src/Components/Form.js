import React, { useState, useContext } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function Form({ showNameField, setShowNameField, setTitle, title }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        // Show an alert for successful signup
        alert("User signed up successfully! You can now log in.");
        // Reset the form fields after successful signup
        setUsername("");
        setEmail("");
        setPassword("");
        setShowNameField(false);
        setTitle("Sign In");
      } else {
        const data = await response.json();
        alert(`Failed to sign up. Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("Form data:", { username, password });
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
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
        localStorage.setItem("access", data.access); // Save the access token to localStorage
        console.log("User signed in successfully!");
        setUser(username); // Set the authenticated user
        navigate("/dashboard"); // Navigate to dashboard
      } else {
        const data = await response.json();
        alert(`Failed to sign in. Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={showNameField ? handleSignUp : handleSignIn}>
        <div className="input-group">
          <div className="input-field" id="nameField">
            <FaUser />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {showNameField ? (
            <div className="input-field">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="input-field invisible"></div>
          )}

          <div className="input-field">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div
          className="btn-field"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button type="submit" id={showNameField ? "signupBtn" : "signinBtn"}>
            {showNameField ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>

      <div
        className="btn-field"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          id="showSignupBtn"
          className={showNameField ? "active" : "disable"}
          onClick={() => {
            setShowNameField(true);
            setTitle("Sign Up");
          }}
          style={{ marginRight: "10px" }}
        >
          Sign Up
        </button>
        <button
          type="button"
          id="showSigninBtn"
          className={!showNameField ? "active" : "disable"}
          onClick={() => {
            setShowNameField(false);
            setTitle("Sign In");
          }}
        >
          Sign In
        </button>
      </div>
    </>
  );
}

export default Form;
