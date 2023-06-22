import {makeAutoObservable} from "mobx";
import {auth} from "../utils/firebase.utils";

class AuthStore {
  isLoggedIn = false;
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
    this.checkUserAuth();
  }

  checkUserAuth() {
    const persistedState = JSON.parse(localStorage.getItem("authState"));

    if (persistedState) {
      this.isLoggedIn = persistedState.isLoggedIn;
      this.currentUser = persistedState.currentUser;
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.persistState();
      } else {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.persistState();
      }
    });
  }

  async login(email, password) {
    await auth.signInWithEmailAndPassword(email, password);
    this.persistState();
  }

  async signUp(displayName, email, password) {
    const {user} = await auth.createUserWithEmailAndPassword(email, password);
    await user.updateProfile({
      displayName: displayName,
    });
    this.persistState();
  }

  async logout() {
    await auth.signOut();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.persistState();
  }

  persistState() {
    const stateToPersist = {
      isLoggedIn: this.isLoggedIn,
      currentUser: this.currentUser,
    };

    localStorage.setItem("authState", JSON.stringify(stateToPersist));
  }
}

const authStore = new AuthStore();
export default authStore;
