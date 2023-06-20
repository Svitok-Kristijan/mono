import React, {useEffect, useState, useRef} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../utils/firebase.utils";
import CarSearchBox from "../car-search-box/car-search-box";
import "./home.scss";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const [carData, setCarData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const carListRef = useRef(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carCollectionRef = collection(db, "Cars");
        const querySnapshot = await getDocs(carCollectionRef);
        const cars = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCarData(cars);
      } catch (error) {
        console.log("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);

  useEffect(() => {
    const filteredCars = carData.filter((car) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const titleMatch = car.title.toLowerCase().includes(lowerCaseQuery);
      const modelMatch = car.VehicleModel.some(
        (model) =>
          model.marke.toLowerCase().includes(lowerCaseQuery) ||
          model.model.toLowerCase().includes(lowerCaseQuery) ||
          model.classe.toLowerCase().includes(lowerCaseQuery)
      );
      return titleMatch || modelMatch;
    });
    setFilteredCars(filteredCars);
    setCurrentSlot(0);
  }, [searchQuery, carData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const navigate = useNavigate();
  const openCarCard = (id) => {
    navigate(`/car/${id}`);
  };
  const handleSlideLeft = () => {
    if (currentSlot === 0) {
      return;
    }
    setCurrentSlot((prevSlot) => prevSlot - 1);
  };

  const handleSlideRight = () => {
    if (currentSlot === filteredCars.length - 1) {
      return;
    }
    setCurrentSlot((prevSlot) => prevSlot + 1);
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
          ref={carListRef}
          style={{
            transform: `translateX(-${currentSlot * 20}%)`,
            width: `${filteredCars.length * 100}%`,
          }}
        >
          {filteredCars.map((car, index) => (
            <div
              className="car-card"
              key={car.id}
              onClick={() => openCarCard(car.id)}
            >
              <h2 className="car-card-title">{car.title}</h2>
              <div className="model-details">
                {[...Array(car.VehicleModel.length)].map((_, modelIndex) => (
                  <div className="model-box" key={modelIndex}>
                    <h3>{car.VehicleModel[modelIndex].marke}</h3>
                    <p>Model: {car.VehicleModel[modelIndex].model}</p>
                    <p>Classe: {car.VehicleModel[modelIndex].classe}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
};

export default Home;
