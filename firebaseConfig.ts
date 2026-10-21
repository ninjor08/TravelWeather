
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXhtmdabp7_wvvLdpov1ojW_PgCDAEy3s",
  authDomain: "travelweather-ae2a5.firebaseapp.com",
  projectId: "travelweather-ae2a5",
  storageBucket: "travelweather-ae2a5.firebasestorage.app",
  messagingSenderId: "309756822331",
  appId: "1:309756822331:web:ebc26eaa71628abff92d1e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
