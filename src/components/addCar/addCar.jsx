import {observer} from "mobx-react";
import {useState} from "react";
import carStore from "../../utils/carStore";

import "./addCar.scss";

const AddCar = observer(() => {
  const [brand, setBrand] = useState("");
  const [marke, setMarke] = useState("");
  const [model, setModel] = useState("");
  const [classe, setClasse] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddCar = () => {
    const car = {
      marke: marke,
      model: model,
      classe: classe,
    };

    if (carStore.validateBrand(brand)) {
      carStore.addCar(car, brand);
      setBrand("");
      setMarke("");
      setModel("");
      setClasse("");
      setIsFormVisible(false);
      carStore.showSuccess();
      setTimeout(() => {
        carStore.closeSuccess();
        carStore.fetchCarData();
      }, 2000);
    } else {
      console.log("Error adding car: Brand not found");
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  return (
    <div className="add-car-container">
      <div className={`add-car-form ${isFormVisible ? "" : "hidden"}`}>
        <label htmlFor="brand"></label>
        <select id="brand" value={brand} onChange={handleBrandChange}>
          <option value="">Select Brand</option>
          <option value="BMW">BMW</option>
          <option value="Audi">Audi</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Opel">Opel</option>
          <option value="Volkswagen">Volkswagen</option>
        </select>

        <label htmlFor="marke"></label>
        <input
          type="text"
          id="marke"
          placeholder="Marke"
          value={marke}
          onChange={(e) => setMarke(e.target.value)}
        />

        <label htmlFor="model"></label>
        <input
          type="text"
          id="model"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <label htmlFor="classe"></label>
        <input
          type="text"
          id="classe"
          placeholder="Classe"
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
        />

        <button onClick={handleAddCar}>Add Car</button>
      </div>

      <button className="hide-form" onClick={toggleFormVisibility}>
        {isFormVisible ? "Hide Form" : "Add Car Form"}
      </button>
    </div>
  );
});

export default AddCar;
