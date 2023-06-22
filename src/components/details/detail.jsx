import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import carStore from "../../utils/carStore";
import "./detail.scss";
import AddCar from "../addCar/addCar";
import EditCar from "../editCar/editCar";

const CarDetails = observer(() => {
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    carStore.fetchCarData();
  }, []);

  const handleFilter = (event) => {
    carStore.setSearchQuery(event.target.value);
    event.preventDefault();
  };

  const handleSort = (event) => {
    carStore.setSortOption(event.target.value);
  };

  const car = carStore.filteredCars.find((car) => car.id === id);

  useEffect(() => {
    if (!car) {
      navigate("/");
    }
  }, [car, navigate]);

  const handleDelete = (carId) => {
    const brand = car.title.toLowerCase();
    carStore.deleteCar(brand, carId);
    console.log(brand);
  };

  if (!car) {
    return <div className="loading">Loading...</div>;
  }

  const {title, VehicleModel} = car;

  const sortedModels = VehicleModel.slice().sort((a, b) => {
    if (carStore.sortOption === "model") {
      return a.model.localeCompare(b.model);
    } else if (carStore.sortOption === "classe") {
      return a.classe.localeCompare(b.classe);
    } else {
      return 0;
    }
  });

  const filteredModels = sortedModels.filter((model) => {
    const lowerCaseQuery = carStore.searchQuery.toLowerCase();
    return (
      model.marke.toLowerCase().includes(lowerCaseQuery) ||
      model.model.toLowerCase().includes(lowerCaseQuery) ||
      model.classe.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div className="div-container">
      {title && <h1>{title}</h1>}
      <input
        type="text"
        placeholder="Filter models..."
        onChange={handleFilter}
      />
      <AddCar />
      <select value={carStore.sortOption} onChange={handleSort}>
        <option value="">Sort by</option>
        <option value="model">Sort by Model</option>
        <option value="classe">Sort by Classe</option>
      </select>
      <div className="car-container">
        {filteredModels.map((model) => (
          <div className={`model-box model-box-${model.id}`} key={model.id}>
            <h3>{model.marke}</h3>
            <p>Model: {model.model}</p>
            <p>Classe: {model.classe}</p>
            <button onClick={() => handleDelete(model.id)}>Delete</button>

            <EditCar
              car={model}
              brand={car.title.toLowerCase()}
              onSave={carStore.updateCar}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default CarDetails;
