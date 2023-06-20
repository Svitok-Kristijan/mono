import {doc, getDoc} from "firebase/firestore";
import {db} from "../../utils/firebase.utils";
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import "./detail.scss";

const CarDetails = () => {
  const {id} = useParams();
  const [car, setCar] = useState(null);
  const [filteredModels, setFilteredModels] = useState([]);
  const [sortOption, setSortOption] = useState("marke");

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carDocRef = doc(db, "Cars", id);
        const carDocSnapshot = await getDoc(carDocRef);
        if (carDocSnapshot.exists()) {
          setCar(carDocSnapshot.data());
          setFilteredModels(carDocSnapshot.data().VehicleModel);
        } else {
          console.log("Car not found");
        }
      } catch (error) {
        console.log("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [id]);

  const handleFilter = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredModels = car.VehicleModel.filter(
      (model) =>
        model.marke.toLowerCase().includes(query) ||
        model.model.toLowerCase().includes(query) ||
        model.classe.toLowerCase().includes(query)
    );
    setFilteredModels(filteredModels);
  };

  const handleSort = (event) => {
    const option = event.target.value;
    setSortOption(option);
    const sortedModels = [...filteredModels].sort((a, b) =>
      a[option].localeCompare(b[option])
    );
    setFilteredModels(sortedModels);
  };

  if (!car) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="div-container">
      <h1>{car.title}</h1>
      <input
        type="text"
        placeholder="Filter models..."
        onChange={handleFilter}
      />
      <select value={sortOption} onChange={handleSort}>
        <option value="model">Sort by Model</option>
        <option value="classe">Sort by Classe</option>
      </select>
      <div className="car-container">
        {filteredModels.map((model) => (
          <div className={`model-box model-box-${model.id}`} key={model.id}>
            <h3>{model.marke}</h3>
            <p>Model: {model.model}</p>
            <p>Classe: {model.classe}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarDetails;
