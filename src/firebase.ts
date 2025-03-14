import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getDatabase , ref ,set }from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAfU5pI9je_0lph61pvHVSDeLUlmFwKpf8",
  authDomain: "todo-4447a.firebaseapp.com",
  projectId: "todo-4447a",
  storageBucket: "todo-4447a.firebasestorage.app",
  messagingSenderId: "593403819508",
  appId: "1:593403819508:web:10b4ea1986f5244c5db5a1",
  measurementId: "G-PTLDTW6DVC",
  databaseURL : "https://todo-4447a-default-rtdb.firebaseio.com",
};


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;