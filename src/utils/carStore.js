import {makeAutoObservable, runInAction, reaction} from "mobx";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
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

  setCurrentSlot(slot) {
    this.currentSlot = slot;
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
    } catch (error) {
      console.log("Error fetching car details:", error);
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
      this.currentSlot = 0;
    });
  };

  setCurrentSlot = (slot) => {
    this.currentSlot = slot;
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

  validateBrand = (brand) => {
    return this.cars.some((car) => car.title === brand);
  };

  addCar = async (car, brand) => {
    try {
      const carsCollectionRef = collection(db, "Cars");
      const querySnapshot = await getDocs(carsCollectionRef);

      let matchingBrand = null;

      querySnapshot.forEach((doc) => {
        const brandData = doc.data();
        if (brandData.title === brand) {
          matchingBrand = doc.ref;
        }
      });

      if (matchingBrand) {
        const brandDocSnapshot = await getDoc(matchingBrand);
        const brandData = brandDocSnapshot.data();
        const existingVehicleModel = brandData.VehicleModel || [];

        const newCar = {
          id: Math.floor(Math.random() * (10000 - 35 + 1)) + 35,
          marke: car.marke,
          model: car.model,
          classe: car.classe,
        };

        existingVehicleModel.push(newCar);

        await setDoc(matchingBrand, {
          ...brandData,
          VehicleModel: existingVehicleModel,
        });

        runInAction(() => {
          this.cars.push(newCar);
          this.filteredCars.push(newCar);
          this.fetchCarData();
        });
      } else {
        console.log("Error adding car: Brand not found");
      }
    } catch (error) {
      console.log("Error adding car:", error);
    }
  };

  async deleteCar(brand, carId) {
    try {
      const carRef = doc(db, "Cars", brand);
      const brandDoc = await getDoc(carRef);

      if (brandDoc.exists()) {
        const brandData = brandDoc.data();
        const models = brandData.VehicleModel || [];

        const updatedModels = models.filter((model) => {
          const modelId =
            typeof model.id === "number" ? model.id.toString() : model.id;
          return modelId !== carId.toString();
        });

        await updateDoc(carRef, {
          VehicleModel: updatedModels,
        });

        runInAction(() => {
          const updatedCars = this.cars.map((car) => {
            if (car.title.toLowerCase() === brand.toLowerCase()) {
              return {...car, VehicleModel: updatedModels};
            } else {
              return car;
            }
          });
          this.cars = updatedCars;
          this.filteredCars = updatedCars.slice();
        });

        const carDocRef = doc(db, "Cars", brand, carId);
        const carDoc = await getDoc(carDocRef);

        if (carDoc.exists()) {
          await deleteDoc(carDocRef);
          console.log("Car deleted successfully");
        }
      }
    } catch (error) {}
  }

  async updateCar(editedCar, brand) {
    try {
      const carRef = doc(db, "Cars", brand);
      const carDoc = await getDoc(carRef);

      if (carDoc.exists()) {
        const brandData = carDoc.data();
        const models = brandData.VehicleModel || [];

        const existingModel = models.find((model) => model.id === editedCar.id);

        if (existingModel) {
          const updatedModels = models.map((model) => {
            if (model.id === editedCar.id) {
              return {
                ...model,
                marke: editedCar.marke,
                model: editedCar.model,
                classe: editedCar.classe,
              };
            } else {
              return model;
            }
          });

          await updateDoc(carRef, {
            VehicleModel: updatedModels,
          });

          // Update the local car object with the edited values
          const updatedCar = {
            ...existingModel,
            marke: editedCar.marke,
            model: editedCar.model,
            classe: editedCar.classe,
          };

          console.log("Car updated successfully");
          return updatedCar; // Return the updated car object
        } else {
          console.log("Error updating car: Model not found");
        }
      } else {
        console.log("Error updating car: Brand not found");
      }
    } catch (error) {
      console.log("Error updating car:", error);
    }
  }
}

const carStore = new CarStore();
export default carStore;
