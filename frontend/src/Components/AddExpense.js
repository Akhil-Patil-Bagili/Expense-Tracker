import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";

const AddExpense = () => {
  const navigate  = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  //const [error, setError] = useState(null);


  const handleAddExpense = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access");
    console.log("Access Token:", accessToken);

  
    // Create an object with the expense data
    const newExpense = {
      amount: parseFloat(amount),
      description: description,
      date: date,
    };

    console.log("Expense data to be sent:", newExpense); 
  
    // Send the expense data to the server (Django backend) using fetch
    fetch("http://127.0.0.1:8000/api/expenses/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add expense.");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response, you can show a success message or navigate back to the Dashboard
        console.log("Expense added successfully!", data);
        navigate("/dashboard");
      })
      .catch((error) => {
        // Handle errors, show an error message, etc.
        console.error("Error:", error);
        console.log("Server Response:", error.response); // Add this line to log the server response
      
        if (error.response && error.response.data) {
          console.log("Error Message from Server:", error.response.data.detail);
          // Handle the error message, show it to the user, etc.
        } else {
          console.log("Unknown Error Occurred.");
          // Handle unknown error, show a generic error message, etc.
        }
      });
      
  };
  

  const handleFormClose = () => {
    navigate("/dashboard"); // Navigate back to the dashboard
  };

  return (
    <div className="add-expense-form">
      <h1>Add Expense</h1>
      <form onSubmit={handleAddExpense}>
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
        <button type="submit" className="add-expense-btn">
          Add Expense
        </button>
        <button type="button" className="close-form-btn" onClick={handleFormClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
