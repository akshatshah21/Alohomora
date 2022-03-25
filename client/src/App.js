import React from "react";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Home } from "./components/home";
import { Router } from "@reach/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Authenticated } from "./components/authenticated";

function App() {
  return (
    <>
      <Router>
        <Register path="/register" />
        <Login path="/login" />
        <Home path="/" />
        <Authenticated path="/authenticated" />
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
