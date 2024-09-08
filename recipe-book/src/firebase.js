// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqphF9yWA1QnGUiXiZpnijIz11NSqNGQQ",
  authDomain: "recipe-book-app-92ee1.firebaseapp.com",
  projectId: "recipe-book-app-92ee1",
  storageBucket: "recipe-book-app-92ee1.appspot.com",
  messagingSenderId: "673590837230",
  appId: "1:673590837230:web:bf2010b71eae613e7918ff",
  measurementId: "G-SB6LCZ0HDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { db };