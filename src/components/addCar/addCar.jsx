import {observer} from "mobx-react";
import {useState} from "react";
import carStore from "../../utils/carStore";
import "./addCar.scss";

const AddCar = observer(() => {
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

    carStore.addCar(car);

    setMarke("");
    setModel("");
    setClasse("");
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="add-car-container">
      <div className={`add-car-form ${isFormVisible ? "" : "hidden"}`}>
        <label htmlFor="marke">Marke</label>
        <input
          type="text"
          id="marke"
          value={marke}
          onChange={(e) => setMarke(e.target.value)}
        />

        <label htmlFor="model">Model</label>
        <input
          type="text"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <label htmlFor="classe">Classe</label>
        <input
          type="text"
          id="classe"
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
