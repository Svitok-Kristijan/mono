import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {observer} from "mobx-react";
import authStore from "./utils/authStore";
import Home from "./components/home/home";
import SignIn from "./components/auth/sign.in";
import CarDetails from "./components/details/detail";

const App = observer(() => {
  const {isLoggedIn} = authStore;

  useEffect(() => {
    authStore.checkUserAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/car/:id" element={<CarDetails />} />
      </Routes>
    </Router>
  );
});

export default App;
