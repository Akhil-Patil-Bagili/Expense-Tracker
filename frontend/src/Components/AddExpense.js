import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message

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
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to add expense.");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Expense added successfully!"); // Set the success message
        // Clear the form fields
        setAmount("");
        setDescription("");
        setDate("");
        // Reset the success message after a delay
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess(null); // Clear success message if there's an error
      });
  };

  const handleFormClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="add-expense-form">
      <h1>Add Expense</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>} {/* Display success message */}
      <form onSubmit={handleAddExpense}>
        <div className="input-field">
          <i className="fas fa-dollar-sign"></i>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
