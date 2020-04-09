import firebase from "firebase";
import "firebase/firestore";

import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  MESSAGE_SENDER_ID,
  APP_ID,
} from "react-native-dotenv";

export const firebaseConfig = {
  apiKey: "AIzaSyCjhJAdel85DhpVgF3UKcMvFKHfnuE0uB0",
  authDomain: "tony-golf-app.firebaseapp.com",
  databaseURL: "https://tony-golf-app.firebaseio.com",
  projectId: "tony-golf-app",
  storageBucket: "tony-golf-app.appspot.com",
  messagingSenderId: "1037650467494",
  appId: "1:1037650467494:web:e432fc02117e1315f0f267",
  measurementId: "G-7JWM62F0RV",
};

const Firebase = firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default Firebase;
