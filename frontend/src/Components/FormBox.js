import React, { useState } from "react";
import Form from "./Form";

function FormBox() {
  const [showNameField, setShowNameField] = useState(false);
  const [title, setTitle] = useState("Sign In");

  return (
    <div className="form-box">
      <h1 id="title">{title}</h1>
      <Form
        showNameField={showNameField}
        setShowNameField={setShowNameField}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
}

export default FormBox;
