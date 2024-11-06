// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYCHanX6PNC5V_U5tLcPFJyURHoibqVGk",
  authDomain: "e-shop-proj.firebaseapp.com",
  projectId: "e-shop-proj",
  storageBucket: "e-shop-proj.appspot.com",
  messagingSenderId: "580127269247",
  appId: "1:580127269247:web:1178e40a1f8067972f3a4a",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;