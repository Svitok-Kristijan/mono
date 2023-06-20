import {useState} from "react";

import "./sign.up.scss";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../../utils/firebase.utils";
import SignIn from "../sign.in";

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

  const backClick = () => {
    setIsVisible(false);
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("please confirm password again");
      return;
    }

    try {
      const {user} = await createAuthUserWithEmailAndPassword(email, password);

      await createUserDocumentFromAuth(user, {displayName});
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email already exists");
      }
      console.error(error);
    }
    resetFormFields();
  };

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value});
  };
  if (isVisible === true) {
    return (
      <div className="auth-container">
        <div className="sing-up-container">
          <h2>Create new account</h2>
          <span className="title-singup">
            Sing up with your email and password
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
              label="Password"
              type="password"
              placeholder="Password"
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

export default SignUp;
