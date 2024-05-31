import React from "react";
import RotatingText from "./RotatingText";
import "../Styles/App.css";

const Home = () => (
  <div className="form-box-home">
    <div className="static-text">Less stress when <br /> tracking finances</div>
    <RotatingText />
  </div>
);

export default Home;
