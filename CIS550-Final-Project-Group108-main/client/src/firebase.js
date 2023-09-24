// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWglNhV9s57AiLrriSzkYz4LCN3doFp0I",
  authDomain: "cis550finalproject-44bef.firebaseapp.com",
  projectId: "cis550finalproject-44bef",
  storageBucket: "cis550finalproject-44bef.appspot.com",
  messagingSenderId: "135910147504",
  appId: "1:135910147504:web:dfbe6994f641a65f808275",
  measurementId: "G-EY51WXHZZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };