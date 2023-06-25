import {makeAutoObservable, runInAction} from "mobx";
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
  isSignUp = false;

  constructor() {
    makeAutoObservable(this);
    this.checkUserAuth();
  }

  async signInWithGoogle() {
    await signInWithGooglePopup();
  }

  SignUpHandler() {
    this.isSignUp = true;
    console.log("signup success");
    setTimeout(() => {
      runInAction(() => {
        this.isSignUp = false;
      });
    }, 3000);
  }

  checkUserAuth() {
    const persistedState = JSON.parse(localStorage.getItem("authState"));

    if (persistedState) {
      runInAction(() => {
        this.isLoggedIn = persistedState.isLoggedIn;
        this.currentUser = persistedState.currentUser;
      });
    } else {
      runInAction(() => {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.persistState();
      });
    }

    onAuthStateChangedListener((user) => {
      runInAction(() => {
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
    });
  }

  async login(email, password) {
    await signInAuthUserWithEmailAndPassword(email, password);
    runInAction(() => {
      this.persistState();
    });
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
    runInAction(() => {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.persistState();
    });
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
