import React, {useState} from "react";
import "./car-search-box.scss";
const CarSearchBox = ({value, onChange, onSearch}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(); // Call onSearch when Enter key is pressed
    }
  };

  return (
    <div className="car-search-box">
      <input
        type="text"
        placeholder="Search Cars"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CarSearchBox;
