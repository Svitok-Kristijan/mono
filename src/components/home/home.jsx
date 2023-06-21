// Home.js
import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {useNavigate} from "react-router-dom";
import CarSearchBox from "../car-search-box/car-search-box";
import "./home.scss";
import carStore from "../../utils/carStore";
import authStore from "../../utils/authStore";

const Home = observer(() => {
  const {
    filteredCars,
    searchQuery,
    setCurrentSlot,
    handleSearchChange,
    handleSlideLeft,
    handleSlideRight,
    fetchCarData,
    fetchCarDetails,
    currentSlot,
  } = carStore;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarData();
  }, []);

  useEffect(() => {
    if (!authStore.isLoggedIn) {
      navigate("/");
    }
  }, [authStore.isLoggedIn, navigate]);

  const openCarCard = async (car) => {
    await fetchCarDetails(car.id);
    navigate(`/car/${car.id}`);
  };

  return (
    <div className="home-container">
      <CarSearchBox
        value={searchQuery}
        onChange={handleSearchChange}
        className="car-search-box"
      />
      <div className="car-list-container">
        <div
          className="car-list"
          style={{
            transform: `translateX(-${currentSlot * 20}%)`,
            width: filteredCars ? `${filteredCars.length * 100}%` : "100%",
          }}
        >
          {filteredCars && filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                className="car-card"
                key={car.id}
                onClick={() => openCarCard(car)}
              >
                <h2 className="car-card-title">{car.title}</h2>
                <div className="model-details">
                  {car.VehicleModel &&
                    car.VehicleModel.map((model, modelIndex) => (
                      <div className="model-box" key={modelIndex}>
                        <h3>{model.marke}</h3>
                        <p>Model: {model.model}</p>
                        <p>Classe: {model.classe}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p>No cars found</p>
          )}
        </div>
      </div>
      <div className="slider-container">
        <button className="slider-button-left" onClick={handleSlideLeft}>
          &lt;
        </button>
        _
        <button className="slider-button-right" onClick={handleSlideRight}>
          &gt;
        </button>
      </div>
    </div>
  );
});

export default Home;
