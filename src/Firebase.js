import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCbyRSlcn8LUGZOmlW-YbJJoC4D28bFLOI",
  authDomain: "plateforme-medecin.firebaseapp.com",
  projectId: "plateforme-medecin",
  storageBucket: "plateforme-medecin.appspot.com",
  messagingSenderId: "657374844332",
  appId: "1:657374844332:web:fe8fc3ef2e424ce620d609",
  measurementId: "G-92EK5E40NR"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
