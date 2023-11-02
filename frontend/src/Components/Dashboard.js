import React, { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import expenseImage from '../expense.png';
import incomeImage from '../income.png';
import chartImage from '../chart.png';

const EXPENSES_URL = "http://127.0.0.1:8000/api/expenses/";
const INCOMES_URL = "http://127.0.0.1:8000/api/incomes/";

const ListComponent = ({ title, items, total, className }) => (
  <div className={className}>
    <h2>{title}</h2>
    <div className="total-amount">
      <strong>Total Amount: {isNaN(total) ? "$0.00" : `$${total.toFixed(2)}`}</strong>
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
        {items.length === 0 ? (
          <tr>
            <td colSpan="3">No {title.toLowerCase()} found</td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id}>
              <td>${parseFloat(item.amount).toFixed(2)}</td>
              <td>{item.description}</td>
              <td>{item.date}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        };

        const fetchWithPagination = async (url) => {
          let data = [];
          let nextUrl = url;

          while (nextUrl) {
            const response = await fetch(nextUrl, { headers });
            if (!response.ok) {
              throw new Error(`Failed to fetch from ${nextUrl}. Status: ${response.status}`);
            }

            const responseData = await response.json();
            data = data.concat(responseData.results);
            nextUrl = responseData.next;
          }

          return data;
        };

        const expensesArray = await fetchWithPagination(EXPENSES_URL);
        const incomesArray = await fetchWithPagination(INCOMES_URL);

        setExpenses(expensesArray);
        setIncomes(incomesArray);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err.message);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    if (!user) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const calculateTotal = (items) => items.reduce((total, item) => {
    const amount = parseFloat(item.amount);
    if (isNaN(amount)) {
      console.warn(`Invalid amount: ${item.amount} for item ID: ${item.id}`);
      return total;
    }
    return total + amount;
  }, 0);

  const totalExpensesMemo = useMemo(() => calculateTotal(expenses), [expenses]);
  const totalIncomesMemo = useMemo(() => calculateTotal(incomes), [incomes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const balance = (totalIncomesMemo - totalExpensesMemo).toFixed(2);
  const balanceStyle = balance > 0 ? "balance-positive" : "balance-negative";

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="welcome-message">
          <h1>Welcome to your Dashboard, {user || "Guest"}!!</h1>
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
            <ListComponent title="Expenses" items={expenses} total={totalExpensesMemo} className="expense-list" />
            <ListComponent title="Incomes" items={incomes} total={totalIncomesMemo} className="income-list" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
