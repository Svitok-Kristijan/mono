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
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
      } else {
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    });
  }

  async login(email, password) {
    await auth.signInWithEmailAndPassword(email, password);
  }

  async signUp(displayName, email, password) {
    const {user} = await auth.createUserWithEmailAndPassword(email, password);
    await user.updateProfile({
      displayName: displayName,
    });
  }

  async logout() {
    await auth.signOut();
  }
}

const authStore = new AuthStore();
export default authStore;
