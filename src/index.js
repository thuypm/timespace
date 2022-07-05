import ReactDOM from "react-dom";
import App from "./App";
import React from "react";
// import "./styles/react-datetime.scss";
//only run this app if cookies is enable
//cuz we authenticate by cookies
ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,

  document.getElementById("root")
);
