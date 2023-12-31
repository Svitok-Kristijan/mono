import React, {useState} from "react";
import "./editCar.scss";
import carStore from "../../utils/carStore";
import {observer} from "mobx-react";

const EditCar = ({car, brand, onSave}) => {
  const [editedCar, setEditedCar] = useState(car);
  const [isVisible, setIsVisible] = useState(false);

  const handleSave = () => {
    onSave(editedCar, brand);
    setIsVisible(false);
    setTimeout(() => {
      carStore.fetchCarData();
    }, 200);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditedCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
  };

  return (
    <div className="edit-container">
      <button className="edit" onClick={toggleVisibility}>
        {!isVisible ? "Edit" : "Close"}
      </button>
      {isVisible && (
        <div className="edit-popup">
          <input
            type="text"
            name="marke"
            value={editedCar.marke}
            onChange={handleChange}
          />
          <input
            type="text"
            name="model"
            value={editedCar.model}
            onChange={handleChange}
          />
          <input
            type="text"
            name="classe"
            value={editedCar.classe}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default observer(EditCar);
