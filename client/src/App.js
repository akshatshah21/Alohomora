import React from "react";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Home } from "./components/home";
import { Router } from "@reach/router";

function App() {
  return (
    <Router>
      <Register path="/register" />
      <Login path="/login" />
      <Home path="/" />
      {/* <Authenticated path="/authenticated" /> */}
    </Router>
  );
}

export default App;
