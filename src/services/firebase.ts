import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase - Configuration automatique via Firebase MCP
const firebaseConfig = {
  apiKey: "AIzaSyDrwATQv123M1Cu4bpoRjb4cDgPDmaJg4c",
  authDomain: "jokkere-mvp.firebaseapp.com",
  projectId: "jokkere-mvp",
  storageBucket: "jokkere-mvp.firebasestorage.app",
  messagingSenderId: "541605905558",
  appId: "1:541605905558:web:517edbe334dc0d866e6eb7"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
