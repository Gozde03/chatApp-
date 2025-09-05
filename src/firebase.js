// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU2-JqFtSWY_RQd_WQqbGEWIIIIclXlHg",
  authDomain: "chatapp-b7625.firebaseapp.com",
  projectId: "chatapp-b7625",
  storageBucket: "chatapp-b7625.appspot.com",
  messagingSenderId: "52063901461",
  appId: "1:52063901461:web:5349b2289906305f007b1c",
  measurementId: "G-Y3N2E2L3XJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
