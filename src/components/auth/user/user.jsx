import React, {useState, useEffect} from "react";
import "./user.scss";
import UserPng from "../../../assets/user-n.png";
import authStore from "../../../utils/authStore";

const UserForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  const handleLogout = () => {
    authStore.logout();
  };
  useEffect(() => {
    const fetchData = async () => {
      await authStore.displayName();
      setDisplayName(authStore.displayNameValue);
    };

    fetchData();
  }, []);

  return (
    <div className="user-container">
      <img onClick={handleVisible} src={UserPng} alt="user image" />
      {isVisible && (
        <div className="form-holder-user">
          <h3>&#8609; &#8609; &#8609;</h3>
          <p className="displayName">{displayName}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserForm;
