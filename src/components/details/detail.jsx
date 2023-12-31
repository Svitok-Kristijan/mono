import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {useParams} from "react-router-dom";
import carStore from "../../utils/carStore";
import "./detail.scss";
import AddCar from "../addCar/addCar";
import EditCar from "../editCar/editCar";
import BackCarPhoto from "../../assets/car-another-min.jpg";
import SuccesfulyAddCar from "../sucesfuly-add-car/suc.add.car";

const CarDetails = observer(() => {
  const {id} = useParams();

  const [isVisible, setIsVisible] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState(null);
  const {isSucces} = carStore;

  useEffect(() => {
    carStore.fetchCarData();
  }, []);

  const handleFilter = (event) => {
    carStore.setSearchQuery(event.target.value);
  };

  const handleSort = (event) => {
    carStore.setSortOption(event.target.value);
  };

  const car = carStore.filteredCars.find((car) => car.id === id);

  const handleDelete = (carId) => {
    setIsVisible(true);
    setCarIdToDelete(carId);
  };

  const handleAction = (accepted) => {
    setIsVisible(false);
    if (accepted && carIdToDelete) {
      const brand = car.title.toLowerCase();
      carStore.deleteCar(brand, carIdToDelete);
    }
    setCarIdToDelete(null);
  };

  if (!car) {
    return <div className="loading"></div>;
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
      <img className="img-responsive" src={BackCarPhoto} alt="car" />
      {title && <h1>{title}</h1>}
      <input
        type="text"
        placeholder="Filter cars..."
        onChange={handleFilter}
        className="input-search"
      />
      <AddCar />
      <select value={carStore.sortOption} onChange={handleSort}>
        <option value="">Sort by</option>
        <option value="model">Sort by Model</option>
        <option value="classe">Sort by Classe</option>
      </select>
      {isSucces && <SuccesfulyAddCar />}
      {isVisible && (
        <div className="del-accept-container">
          <span>Are you sure you want to delete this car ?</span>
          <button className="myButton" onClick={() => handleAction(true)}>
            Accept
          </button>
          <button
            className="myButton btn-second"
            onClick={() => handleAction(false)}
          >
            Decline
          </button>
        </div>
      )}
      <div className="car-container">
        {filteredModels.map((model) => (
          <div className={`model-box model-box-${model.id}`} key={model.id}>
            <h3>{model.marke}</h3>
            <p>Model: {model.model}</p>
            <p>Classe: {model.classe}</p>
            <button className="btn-del" onClick={() => handleDelete(model.id)}>
              Delete
            </button>

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
