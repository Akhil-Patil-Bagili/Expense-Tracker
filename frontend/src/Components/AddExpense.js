import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  const handleAddExpense = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access");
    const newExpense = {
      amount: parseFloat(amount),
      description: description,
      date: date,
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/expenses/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Failed to add expense.");
          });
        }
        return response.json();
      })
      .then((data) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleFormClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="add-expense-form">
      <h1>Add Expense</h1>
      {error && <p className="error-message">{error}</p>}
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