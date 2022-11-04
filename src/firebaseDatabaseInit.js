// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
require('firebase/auth');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO_faChjpgu8zUUZtztx2Ele4zuhr2Wyk",
  authDomain: "fifa-world-cup-2022-qata-6432b.firebaseapp.com",
  projectId: "fifa-world-cup-2022-qata-6432b",
  storageBucket: "fifa-world-cup-2022-qata-6432b.appspot.com",
  messagingSenderId: "787312230252",
  appId: "1:787312230252:web:67cced85367dd443667d49",
  measurementId: "G-00M6M797C9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app