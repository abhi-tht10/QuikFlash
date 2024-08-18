// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKkU7XsKSI7pfpb38_kUKZ4a2uV28HOJg",
  authDomain: "flashcardsaas-3ff2d.firebaseapp.com",
  projectId: "flashcardsaas-3ff2d",
  storageBucket: "flashcardsaas-3ff2d.appspot.com",
  messagingSenderId: "764861457895",
  appId: "1:764861457895:web:e1d29237d7ccb067db8942",
  measurementId: "G-43Q97BWZ79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};