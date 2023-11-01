import React from "react";
import RotatingText from "./RotatingText";
import "../Styles/App.css";

function Home() {
  return (
    <div className="form-box-home">
      <h1>
        <b>
          Less stress when <br />
          tracking finances
        </b>
      </h1>
      <div id="changeText"> </div>
      <RotatingText />
    </div>
  );
}
export default Home;
