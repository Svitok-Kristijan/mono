import {makeAutoObservable, runInAction, reaction} from "mobx";
import {doc, getDoc, collection, getDocs, addDoc} from "firebase/firestore";
import {db} from "./firebase.utils";

class CarStore {
  cars = [];
  filteredCars = [];
  searchQuery = "";
  currentSlot = 0;
  car = null;
  sortOption = "";

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.searchQuery,
      () => this.filterCars()
    );
  }

  fetchCarData = async () => {
    try {
      const carCollectionRef = collection(db, "Cars");
      const querySnapshot = await getDocs(carCollectionRef);
      const cars = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      runInAction(() => {
        this.cars = cars;
        this.filteredCars = cars;
      });
      console.log("Fetched cars:", cars);
    } catch (error) {
      console.log("Error fetching car data:", error);
    }
  };

  fetchCarDetails = async (carId) => {
    try {
      const carDocRef = doc(db, "Cars", carId);
      const carDocSnapshot = await getDoc(carDocRef);
      const carData = carDocSnapshot.data();
      runInAction(() => {
        this.car = carData;
      });
      console.log("Fetched car details:", carData);
    } catch (error) {
      console.log("Error fetching car details:", error);
    }
  };

  addCar = async (car) => {
    try {
      const carCollectionRef = collection(db, "Cars");
      await addDoc(carCollectionRef, car);

      await this.fetchCarData();
    } catch (error) {
      console.log("Error adding car:", error);
    }
  };

  setSearchQuery = (query) => {
    this.searchQuery = query;
  };

  filterCars = () => {
    const {searchQuery, cars} = this;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredCars = cars.filter((car) => {
      const titleMatch = car.title.toLowerCase().includes(lowerCaseQuery);
      const modelMatch = car.VehicleModel.some(
        (model) =>
          model.marke.toLowerCase().includes(lowerCaseQuery) ||
          model.model.toLowerCase().includes(lowerCaseQuery) ||
          model.classe.toLowerCase().includes(lowerCaseQuery)
      );
      return titleMatch || modelMatch;
    });
    runInAction(() => {
      this.filteredCars = filteredCars;
      this.currentSlot = 0;
    });
  };

  setCurrentSlot = (slot) => {
    this.currentSlot = slot;
  };

  handleSearchChange = (event) => {
    this.setSearchQuery(event.target.value);
  };

  handleSlideLeft = () => {
    if (this.currentSlot === 0) {
      return;
    }
    this.setCurrentSlot(this.currentSlot - 1);
  };

  handleSlideRight = () => {
    if (this.currentSlot === this.filteredCars.length - 1) {
      return;
    }
    this.setCurrentSlot(this.currentSlot + 1);
  };

  setSortOption = (option) => {
    runInAction(() => {
      this.sortOption = option;
    });
  };
}

const carStore = new CarStore();
export default carStore;
