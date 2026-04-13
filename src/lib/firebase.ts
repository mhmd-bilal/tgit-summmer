import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// You can swap these with your real config later
const firebaseConfig = {
  apiKey: "AIzaSyBXeKmQ6NH0dD7ERftYg7ZjX5DivWD1gNg",
  authDomain: "tgit-summer-2026.firebaseapp.com",
  projectId: "tgit-summer-2026",
  storageBucket: "tgit-summer-2026.firebasestorage.app",
  messagingSenderId: "577068024468",
  appId: "1:577068024468:web:615831e31ab4beb6fdea81"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
