// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuOxaFESRfCogj9ch38uXJS0l9FSjlqkg",
  authDomain: "perfume-adbcb.firebaseapp.com",
  projectId: "perfume-adbcb",
  storageBucket: "perfume-adbcb.firebasestorage.app",
  messagingSenderId: "235693642562",
  appId: "1:235693642562:web:5e6453cbc42fa4242feedb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);