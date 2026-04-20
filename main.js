import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDgeMPAM9aKivOPLBuF_Fqm8uhedO5jeYc",
    authDomain: "go-rabbit-4af82.firebaseapp.com",
    projectId: "go-rabbit-4af82",
    storageBucket: "go-rabbit-4af82.firebasestorage.app",
    messagingSenderId: "746967187087",
    appId: "1:746967187087:web:d2413f9cb46efae41cbafa",
    measurementId: "G-BJLK9339LN"
  };
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
} catch (e) {
  console.warn("Analytics error:", e);
}

// Minimal main.js
document.addEventListener('DOMContentLoaded', () => {
  console.log("Studio Hub initialized.");
});
