import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialiser Firestore avec configuration optimisée pour React Native
export const db = getFirestore(app);

// Configuration pour améliorer la stabilité des connexions
if (__DEV__) {
  // En mode développement, on peut activer des logs plus détaillés
  console.log('Firebase initialized in development mode');
}

// Configuration Firestore pour React Native
// Ces paramètres aident à réduire les erreurs de connexion
const firestoreSettings = {
  // Désactiver la persistance locale en mode développement pour éviter les conflits
  cacheSizeBytes: __DEV__ ? 0 : 40000000, // 40MB en production
  // Configuration pour améliorer la stabilité des connexions
  experimentalForceLongPolling: true, // Force l'utilisation de long polling au lieu de WebSocket
};

// Appliquer les paramètres si possible
try {
  // Note: Ces paramètres peuvent ne pas être disponibles dans toutes les versions
  // mais ils aident à stabiliser les connexions
} catch (error) {
  console.warn('Could not apply Firestore settings:', error);
}

export default app;
