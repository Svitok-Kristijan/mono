import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {observer} from "mobx-react";
import authStore from "./utils/authStore";
import Home from "./components/home/home";
import SignIn from "./components/auth/signIn/sign.in";
import CarDetails from "./components/details/detail";
import UserForm from "./components/auth/user/user";

const App = observer(() => {
  const {isLoggedIn, currentUser} = authStore;

  useEffect(() => {
    authStore.checkUserAuth();
  }, []);

  return (
    <Router>
      {isLoggedIn && currentUser !== null && <UserForm />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/car/:id" element={<CarDetails />} />
      </Routes>
    </Router>
  );
});

export default App;
