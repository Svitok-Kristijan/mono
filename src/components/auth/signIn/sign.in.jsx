import {useState, useEffect} from "react";
import "./sign.in.scss";
import {signInWithGooglePopup} from "../../../utils/firebase.utils";
import SignUp from "../signUp/sign.up";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import authStore from "../../../utils/authStore";

const defaultFormFieldsSignIn = {
  email: "",
  password: "",
};

const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFieldsSignIn);
  const {email, password} = formFields;
  const navigate = useNavigate();
  const {login} = authStore;

  const resetFormFields = () => {
    setFormFields(defaultFormFieldsSignIn);
  };

  const signInWithGoogle = async () => {
    await authStore.signInWithGoogle();
    navigate("/home");
  };

  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    authStore.login();

    try {
      await authStore.login(email, password);
      resetFormFields();
      navigate("/home");
    } catch (error) {
      alert("Wrong Email or Password");
    }
  };

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value});
  };

  if (isVisible === false) {
    return (
      <div className="auth-container">
        <div className="signIn-container">
          <h2>Already have an account?</h2>
          <span>Sign in with your email and password</span>
          <form className="form-container" onSubmit={handleSubmit}>
            <input
              className="input-email"
              placeholder="Email"
              label="Email"
              type="email"
              required
              onChange={handleChange}
              name="email"
              value={email}
            />

            <input
              className="input-password"
              placeholder="Password"
              label="Password"
              type="password"
              required
              onChange={handleChange}
              name="password"
              value={password}
            />
            <div>
              <button className="btn-submit" type="submit">
                Sign In
              </button>
              <button
                className="btn-google"
                type="button"
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </button>
              <div className="acc-new">
                <span>
                  If you don't have an account, create a new one<br></br>
                  <br></br>
                  <span onClick={handleClick} className="link">
                    Make new account
                  </span>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (isVisible === true) return <SignUp />;
};

export default observer(SignIn);
