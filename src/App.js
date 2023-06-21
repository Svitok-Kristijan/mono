import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {observer} from "mobx-react";
import authStore from "./utils/authStore";
import Home from "./components/home/home";
import SignIn from "./components/auth/sign.in";
import CarDetails from "./components/details/detail";

const App = () => {
  const {isLoggedIn} = authStore;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />

        {isLoggedIn ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </>
        ) : (
          <Route path="*" element={<SignIn />} />
        )}
      </Routes>
    </Router>
  );
};

export default observer(App);
