import React, { useState, useEffect } from "react";
import "../Styles/App.css";

const ROTATING_TEXTS = [
  "on Trips.",
  "with Friends.",
  "with Roomates.",
  "with your Partner.",
  "with Anyone.",
];

function RotatingText() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((currentCounter) => (currentCounter + 1) % ROTATING_TEXTS.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return <div id="changeText">{ROTATING_TEXTS[counter]}</div>;
}

export default RotatingText;
