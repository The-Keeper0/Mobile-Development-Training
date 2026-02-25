import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs-MOZb3keD0eW4nc5JmzhUFX4tckLqro",
  authDomain: "mobile-training-tracker.firebaseapp.com",
  projectId: "mobile-training-tracker",
  storageBucket: "mobile-training-tracker.firebasestorage.app",
  messagingSenderId: "276309460612",
  appId: "1:276309460612:web:3c597f6b0eac2a1c6964d1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
