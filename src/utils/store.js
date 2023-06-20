import {configure, observable, action, makeAutoObservable} from "mobx";
import {
  signInWithGooglePopup,
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getCategoriesAndDocuments,
  addCollectionAndDocuments,
  db,
  auth,
} from "../utils/firebase.utils";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

class AppStore {
  isVisible = false;
  formFields = {
    email: "",
    password: "",
  };
  currentUser = null;
  categories = [];

  constructor() {
    makeAutoObservable(this);
  }

  resetFormFields() {
    this.formFields = {
      email: "",
      password: "",
    };
  }

  signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };

  signInWithEmailAndPassword = async (email, password) => {
    await signInAuthUserWithEmailAndPassword(email, password);
    this.resetFormFields();
  };

  signOut = async () => {
    await signOutUser();
  };

  createUserWithEmailAndPassword = async (email, password) => {
    await createAuthUserWithEmailAndPassword(email, password);
    this.resetFormFields();
  };

  handleAuthStateChanged = async () => {
    onAuthStateChangedListener((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  };

  createUserDocumentFromAuth = async () => {
    await createUserDocumentFromAuth(this.currentUser);
  };

  loadCategories = async () => {
    const categories = await getCategoriesAndDocuments();
    this.categories = categories;
  };

  addDocumentsToCollection = async (collectionKey, objectsToAdd) => {
    await addCollectionAndDocuments(collectionKey, objectsToAdd);
  };
}

const store = new AppStore();
export default store;
