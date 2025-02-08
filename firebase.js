import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAl0EMbYNwC0Doi-CZZCXJ9MPnIFMSwlPE",
  authDomain: "a3d-tools.firebaseapp.com",
  projectId: "a3d-tools",
  storageBucket: "a3d-tools.firebasestorage.app",
  messagingSenderId: "933707905033",
  appId: "1:933707905033:web:d72eea27bb9112668860d8",
};

const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);
export { db };

// Auth con AsyncStorage (si aún necesitas la persistencia)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // Usa getAuth si ya fue inicializado
}

export { auth };
