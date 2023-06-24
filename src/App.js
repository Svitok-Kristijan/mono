import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <SignIn />}
        ></Route>
        <Route
          path="/home"
          element={!isLoggedIn ? <Navigate to="/" /> : <Home />}
        />
        <Route
          path="/home/car/:id"
          element={!isLoggedIn ? <Navigate to="/" /> : <CarDetails />}
        />
      </Routes>
      {isLoggedIn && currentUser !== null && <UserForm />}
    </Router>
  );
});

export default App;
