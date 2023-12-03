import React, { useState, createContext } from "react";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import AboutView from "./Components/AboutView";
import Contact from "./Components/Contact";
import FormBox from "./Components/FormBox";
import Dashboard from "./Components/Dashboard";
import AddExpense from "./Components/AddExpense";
import AddIncome from "./Components/AddIncome"; 
import GraphView from "./Components/GraphView";
import ChatBot from "./Components/ChatBot";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Styles/App.css";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="container-home">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<FormBox />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/add-income" element={<AddIncome />} />
            <Route path="/view-graphs" element={<GraphView />} />
            <Route path="/chat" element={<ChatBot />} />
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
