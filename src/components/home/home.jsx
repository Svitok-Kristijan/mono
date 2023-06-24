import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {useNavigate} from "react-router-dom";
import CarPhoto from "../../assets/car.jpg";
import "./home.scss";
import carStore from "../../utils/carStore";
import authStore from "../../utils/authStore";
import NewAccSucc from "../auth/signUp/new-acc/new.acc";

//import {addCollectionAndDocuments} from "../../utils/firebase.utils";
//import CAR_DATA from "../../car-data";
const Home = observer(() => {
  const {
    filteredCars,
    searchQuery,
    setCurrentSlot,

    handleSlideLeft,
    handleSlideRight,
    fetchCarData,
    fetchCarDetails,
    currentSlot,
  } = carStore;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

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
    navigate(`/home/car/${car.id}`);
  };

  return (
    <div className="home-container">
      <img className="background-car" src={CarPhoto} alt="car pic" />
      {!authStore.isSignUp && <NewAccSucc />}
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
        <p className="currentSlot">{currentSlot + 1}</p>
        <button className="slider-button-right" onClick={handleSlideRight}>
          &gt;
        </button>
      </div>
    </div>
  );
});

export default Home;
