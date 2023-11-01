import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import expenseImage from '../expense.png';
import incomeImage from '../income.png';
import chartImage from '../chart.png';


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        console.log("JWT Token:", token);

        const headers = {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        };

        // Fetch expenses and handle response
        const expensesResponse = await fetch("http://127.0.0.1:8000/api/expenses/", { headers });
        if (!expensesResponse.ok) {
          throw new Error("Failed to fetch expenses.");
        }
        let expensesData = await expensesResponse.json();

        // Handle pagination response correctly
        let expensesArray = [];
        let nextPageExpenses = expensesData.next;
        while (nextPageExpenses) {
          expensesArray = expensesArray.concat(expensesData.results);
          const nextPageResponse = await fetch(nextPageExpenses, { headers });
          if (!nextPageResponse.ok) {
            throw new Error("Failed to fetch expenses.");
          }
          expensesData = await nextPageResponse.json();
          nextPageExpenses = expensesData.next;
        }
        expensesArray = expensesArray.concat(expensesData.results);
        // End of pagination handling

        console.log("Expenses Data:", expensesArray);

        // Fetch incomes and handle response
        const incomesResponse = await fetch("http://127.0.0.1:8000/api/incomes/", { headers });
        if (!incomesResponse.ok) {
          throw new Error("Failed to fetch incomes.");
        }
        let incomesData = await incomesResponse.json();

        // Handle pagination response correctly
        let incomesArray = [];
        let nextPageIncomes = incomesData.next;
        while (nextPageIncomes) {
          incomesArray = incomesArray.concat(incomesData.results);
          const nextPageResponse = await fetch(nextPageIncomes, { headers });
          if (!nextPageResponse.ok) {
            throw new Error("Failed to fetch incomes.");
          }
          incomesData = await nextPageResponse.json();
          nextPageIncomes = incomesData.next;
        }
        incomesArray = incomesArray.concat(incomesData.results);
        // End of pagination handling

        console.log("Incomes Data:", incomesArray);
        

        setExpenses(expensesArray);
        setIncomes(incomesArray);
        console.log("Dashboard Expenses Set:", expensesArray); // Debug Step: Confirm data set in state
        console.log("Dashboard Incomes Set:", incomesArray); 
        setTotalExpenses(calculateTotalExpenses(expensesArray));
        setTotalIncomes(calculateTotalIncomes(incomesArray));
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching expenses and incomes");
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const calculateTotalIncomes = (incomes) => {
    return incomes.reduce((total, income) => total + parseFloat(income.amount), 0);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const balance = (totalIncomes - totalExpenses).toFixed(2);
  const balanceStyle = balance > 0 ? "balance-positive" : "balance-negative";

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="welcome-message">
          <h1>Welcome to your Dashboard, {user ? user : "Guest"}!!</h1>
        </div>
        <div className="card-container">
          <Link to="/add-expense" className="card">
            <img src={expenseImage} alt="Expense" />
            <p>Add an Expense</p>
          </Link>
          <Link to="/add-income" className="card">
            <img src={incomeImage} alt="Income" />
            <p>Add an Income</p>
          </Link>
          <Link to="/view-graphs" className="card">
                    <img src={chartImage} alt="Chart" />
                    <p>View Graphs</p>
          </Link>
        </div>
        <div className="balance-container">
          <h2>Balance</h2>
          <div className={`balance ${balanceStyle}`}>
            <strong>${balance}</strong>
          </div>
        </div>
        <div className="expense-income-container">
          <div className="list-container">
          <div className="expense-list">
            <h2>Expenses</h2>
            <div className="total-amount">
              <strong>Total Amount: {isNaN(totalExpenses) ? "$0.00" : `$${totalExpenses.toFixed(2)}`}</strong>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Add conditional rendering here */}
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="3">No expenses found</td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>${parseFloat(expense.amount).toFixed(2)}</td>
                      <td>{expense.description}</td>
                      <td>{expense.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="income-list">
            <h2>Incomes</h2>
            <div className="total-amount">
              <strong>Total Amount: {isNaN(totalIncomes) ? "$0.00" : `$${totalIncomes.toFixed(2)}`}</strong>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Add conditional rendering here */}
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan="3">No incomes found</td>
                  </tr>
                ) : (
                  incomes.map((income) => (
                    <tr key={income.id}>
                      <td>${parseFloat(income.amount).toFixed(2)}</td>
                      <td>{income.description}</td>
                      <td>{income.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
