

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxztZgsj5kxwJUy8VSkeVH-8d6C4_9aZw",
    authDomain: "task-manager-ae1d6.firebaseapp.com",
    projectId: "task-manager-ae1d6",
    storageBucket: "task-manager-ae1d6.firebasestorage.app",
    messagingSenderId: "468068756460",
    appId: "1:468068756460:web:a6c56659503c4062cbaec9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app