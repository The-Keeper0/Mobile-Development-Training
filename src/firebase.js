// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs-MOZb3keD0eW4nc5JmzhUFX4tckLqro",
  authDomain: "mobile-training-tracker.firebaseapp.com",
  projectId: "mobile-training-tracker",
  storageBucket: "mobile-training-tracker.firebasestorage.app",
  messagingSenderId: "276309460612",
  appId: "1:276309460612:web:3c597f6b0eac2a1c6964d1",
  measurementId: "G-ZEJ5XQ5ZYL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
