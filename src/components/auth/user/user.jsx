import React, {useState} from "react";
import "./user.scss";
import UserPng from "../../../assets/user.png";
import authStore from "../../../utils/authStore";

const UserForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  const handleLogout = () => {
    authStore.logout();
  };

  return (
    <div className="user-container">
      <img onClick={handleVisible} src={UserPng} alt="user image" />
      {isVisible && (
        <div className="form-holder-user">
          <h3>&#8609; &#8609; &#8609;</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserForm;
