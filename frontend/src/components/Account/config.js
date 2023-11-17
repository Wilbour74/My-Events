import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwPpQ1CkX9oQKSjachJReHDN7Z1tive5Q",
    authDomain: "eventsconnexion-3c9a0.firebaseapp.com",
    projectId: "eventsconnexion-3c9a0",
    storageBucket: "eventsconnexion-3c9a0.appspot.com",
    messagingSenderId: "802625007308",
    appId: "1:802625007308:web:cc099fdc9727ae3dcbdc69"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{auth, provider};