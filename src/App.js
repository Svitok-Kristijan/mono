import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

//import store from "./utils/store";
import SignIn from "./components/auth/sign.in";
import Home from "./components/home/home";
import CarDetails from "./components/details/detail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/car/:id" element={<CarDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
