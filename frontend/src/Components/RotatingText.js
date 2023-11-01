import React, { useState, useEffect } from "react";
import "../Styles/App.css";

function RotatingText() {
  const [counter, setCounter] = useState(0);
  const text = [
    "on Trips.",
    "with Friends.",
    "with Roomates.",
    "with your Partner.",
    "with Anyone.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((currentCounter) => {
        if (currentCounter >= text.length - 1) {
          return 0;
        }
        return currentCounter + 1;
      });
    }, 2000);
    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [text.length]);

  return <div id="changeText">{text[counter]}</div>;
}

export default RotatingText;
