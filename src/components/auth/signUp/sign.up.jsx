import {useState} from "react";
import "./sign.up.scss";

import SignIn from "../signIn/sign.in";
import {observer} from "mobx-react-lite";
import authStore from "../../../utils/authStore";
import {useNavigate} from "react-router-dom";
import NewAccSucc from "./new-acc/new.acc";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {displayName, email, password, confirmPassword} = formFields;
  const [isVisible, setIsVisible] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const backClick = () => {
    setIsVisible(false);
  };
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  const redirectHandle = () => {
    setTimeout(() => {
      navigate("/home");
    }, 1560);
  };

  const loginHandler = () => {
    setIsLogin(true);
  };
  const hideElement = () => {
    setTimeout(() => {
      setIsLogin(false);
    }, 1550);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Please confirm password again");
      return;
    }

    try {
      const userCredential = await authStore.signUpNew(
        displayName,
        email,
        password
      );

      if (userCredential && userCredential.user) {
        authStore.login(email, password);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email already exists");
      }
      console.error(error);
    }
    resetFormFields();
    redirectHandle();
    loginHandler();
    hideElement();
  };

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value});
  };
  if (isVisible === true) {
    return (
      <div className="auth-container">
        {isLogin && isVisible && <NewAccSucc />}
        <div className="sing-up-container">
          <h2>Create new account</h2>
          <span className="title-singup">
            Sign up with your email and password
          </span>
          <form onSubmit={handleSubmit}>
            <input
              label="Display name"
              type="text"
              placeholder="Name"
              required
              onChange={handleChange}
              name="displayName"
              value={displayName}
            />

            <input
              label="Email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              name="email"
              value={email}
            />

            <input
              label="Password "
              type="password"
              placeholder="Password (min 6 digits)"
              required
              onChange={handleChange}
              name="password"
              value={password}
            />

            <input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              name="confirmPassword"
              value={confirmPassword}
            />
            <div className="btn-div">
              <button className="btn" type="submit">
                Sign Up
              </button>
            </div>

            <span onClick={backClick} className="back-signIn">
              Back to Sign In
            </span>
          </form>
        </div>
      </div>
    );
  } else if (isVisible === false) return <SignIn />;
};

export default observer(SignUp);
