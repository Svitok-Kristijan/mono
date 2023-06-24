import {makeAutoObservable} from "mobx";

import "firebase/auth";
import {
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  signOutUser,
  onAuthStateChangedListener,
  signInWithGooglePopup,
} from "./firebase.utils";

class AuthStore {
  isLoggedIn = false;
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
    this.checkUserAuth();
  }

  async signInWithGoogle() {
    await signInWithGooglePopup();
  }

  checkUserAuth() {
    const persistedState = JSON.parse(localStorage.getItem("authState"));

    if (persistedState) {
      this.isLoggedIn = persistedState.isLoggedIn;
      this.currentUser = persistedState.currentUser;
    } else {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.persistState();
    }

    onAuthStateChangedListener((user) => {
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
    await signInAuthUserWithEmailAndPassword(email, password);
    this.persistState();
  }

  async signUpNew(displayName, email, password) {
    const userCredential = await createAuthUserWithEmailAndPassword(
      email,
      password
    );

    if (userCredential && userCredential.user) {
      const {user} = userCredential;
      await createUserDocumentFromAuth(user, {displayName});

      await user.updateProfile({
        displayName: displayName,
      });
    }
  }

  async logout() {
    await signOutUser();
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
