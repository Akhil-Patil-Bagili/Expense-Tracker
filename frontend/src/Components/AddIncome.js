// AddIncome.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";

const AddIncome = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleAddIncome = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access");
    // Create an object with the income data
    const newIncome = {
      amount: parseFloat(amount),
      description,
      date,
    };

    // Send the income data to the server (Django backend) using fetch
    fetch("http://127.0.0.1:8000/api/incomes/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newIncome),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add income.");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response, you can show a success message or navigate back to the Dashboard
      console.log("Income added successfully!", data);
      navigate("/dashboard");
    })
      .catch((error) => {
        // Handle errors, show an error message, etc.
        console.error("Error:", error);
      });
  };

  const handleFormClose = () => {
    navigate("/dashboard"); // Navigate back to the dashboard
  };

  return (
    <div className="add-income-form">
      <h1>Add Income</h1>
      <form onSubmit={handleAddIncome}>
      <div className="input-field">
          <i className="fas fa-dollar-sign"></i>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            // placeholder="$"
            required
          />
        </div>

        <div className="input-field">
          <i className="fas fa-edit"></i>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
        </div>

        <div className="input-field">
          <i className="far fa-calendar-alt"></i>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="add-income-btn">
          Add Income
        </button>
        <button type="button" className="close-form-btn" onClick={handleFormClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default AddIncome;
