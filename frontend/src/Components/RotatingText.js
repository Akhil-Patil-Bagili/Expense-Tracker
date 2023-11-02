import React, { useState, useEffect } from "react";
import "../Styles/App.css";

// Static array of rotating texts
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
    // Rotate text every 2 seconds
    const timer = setInterval(() => {
      setCounter((currentCounter) => (currentCounter + 1) % ROTATING_TEXTS.length);
    }, 2000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return <div id="changeText">{ROTATING_TEXTS[counter]}</div>;
}

export default RotatingText;
