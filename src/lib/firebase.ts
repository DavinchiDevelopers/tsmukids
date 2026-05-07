import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDM2RiEZmoWS1ncWEcyvHzv0r11NBCfSjc',
  authDomain: 'medcare-clinic.firebaseapp.com',
  projectId: 'medcare-clinic',
  storageBucket: 'medcare-clinic.firebasestorage.app',
  messagingSenderId: '248351278919',
  appId: '1:248351278919:web:dd7518efb9ebf66dacae62',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
