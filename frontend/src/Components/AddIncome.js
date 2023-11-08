import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";

const AddIncome = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  const handleAddIncome = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access");
    const newIncome = {
      amount: parseFloat(amount),
      description,
      date,
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/incomes/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newIncome),
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.detail || "Failed to add income.");
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
    <div className="add-income-form">
      <h1>Add Income</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddIncome}>
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