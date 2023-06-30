import {makeAutoObservable, runInAction} from "mobx";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./firebase.utils";
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
  displayNameValue = "";

  constructor() {
    makeAutoObservable(this);
    this.checkUserAuth();
  }

  async signInWithGoogle() {
    await signInWithGooglePopup();
  }

  SignUpHandler() {
    this.isSignUp = true;

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
          this.displayName();
          this.persistState();
        } else {
          this.isLoggedIn = false;
          this.currentUser = null;
          this.displayNameValue = "";
          this.persistState();
        }
      });
    });
  }

  async login(email, password) {
    await signInAuthUserWithEmailAndPassword(email, password);
    runInAction(() => {
      this.displayName();
      this.persistState();
    });
  }

  async displayName() {
    const userId = this.currentUser?.uid;

    if (userId) {
      const userRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData && userData.hasOwnProperty("displayName")) {
          const displayName = userData.displayName;
          runInAction(() => {
            this.displayNameValue = displayName;
          });
        }
      }
    }
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
      runInAction(() => {
        this.displayName();
      });
    }
  }

  async logout() {
    await signOutUser();
    runInAction(() => {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.displayNameValue = "";
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
