import React, {useEffect, useState} from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await authStore.checkUserAuth();
      setIsLoading(false);
    };

    fetchData();
  }, [authStore.checkUserAuth]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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
          caseSensitive={true}
          element={!isLoggedIn ? <Navigate to="/" /> : <CarDetails />}
        />
      </Routes>
      {isLoggedIn && currentUser !== null && <UserForm />}
    </Router>
  );
});

export default App;
