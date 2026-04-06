import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuOxaFESRfCogj9ch38uXJS0l9FSjlqkg",
  authDomain: "perfume-adbcb.firebaseapp.com",
  projectId: "perfume-adbcb",
  storageBucket: "perfume-adbcb.firebasestorage.app",
  messagingSenderId: "235693642562",
  appId: "1:235693642562:web:5e6453cbc42fa4242feedb"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
