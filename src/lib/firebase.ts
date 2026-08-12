import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBdGjEGWp1Z1CVlHp-lRyGW6bemPxA81CY',
  authDomain: 'tsmukids.firebaseapp.com',
  projectId: 'tsmukids',
  storageBucket: 'tsmukids.firebasestorage.app',
  messagingSenderId: '344516528237',
  appId: '1:344516528237:web:c12aea83d1775ac2025764',
};

const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = isNewApp
  ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
  : getFirestore(app);
export default app;
