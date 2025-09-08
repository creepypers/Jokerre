# Jokkere - Application de Gestion de Projets Agile

Application mobile et web de gestion de projets avec tableau Kanban, développée avec React Native, Expo et Firebase.

## 🎨 Palette de Couleurs

L'application utilise une palette de couleurs "Africain moderne" :
- **Ocre chaud** (#D97706) - Accent / boutons / titres
- **Terracotta doux** (#F97316) - Background secondaire / highlights  
- **Vert feuille** (#16A34A) - Succès / validation / bordures
- **Sable clair** (#FDE68A) - Fond clair / cartes / colonnes Kanban
- **Brun profond** (#4B2E2E) - Texte principal / titres secondaires
- **Gris chaud** (#A3A3A3) - Texte secondaire / bordures / placeholders

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Compte Firebase

### 2. Installation des dépendances
```bash
cd jokkere-app
npm install
```

### 3. Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez l'authentification (Email/Password)
3. Créez une base de données Firestore
4. Remplacez la configuration dans `src/services/firebase.ts` :

```typescript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-project-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "votre-sender-id",
  appId: "votre-app-id"
};
```

### 4. Règles Firestore

Configurez ces règles dans Firebase Console > Firestore > Règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projets - accessibles aux membres
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
    }
    
    // Tickets - accessibles aux membres du projet
    match /tickets/{ticketId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.members;
      allow create: if request.auth != null;
    }
  }
}
```

## 🏃‍♂️ Lancement de l'application

### Web
```bash
npm run web
```

### Mobile (avec Expo Go)
```bash
npm start
```
Puis scannez le QR code avec l'app Expo Go sur votre téléphone.

### Android (build local)
```bash
npm run android
```

### iOS (macOS uniquement)
```bash
npm run ios
```

## 📱 Fonctionnalités

### ✅ Implémentées
- **Authentification** : Connexion et inscription avec Firebase Auth
- **Gestion des projets** : Création, affichage et suppression de projets
- **Tableau Kanban** : Vue en colonnes (À faire, En cours, Terminé)
- **Gestion des tickets** : Création, modification et suppression
- **Drag & Drop** : Déplacement des tickets entre les colonnes
- **Design responsive** : Interface adaptée mobile et web
- **Palette de couleurs** : Thème africain moderne

### 🔄 En cours de développement
- Assignation des tickets à des utilisateurs
- Notifications locales
- Mode hors ligne
- Recherche et filtres

## 🏗️ Architecture

```
src/
├── components/     # Composants réutilisables
├── screens/        # Écrans principaux
├── navigation/     # Configuration de navigation
├── services/       # Services Firebase
├── context/        # Gestion d'état (Context API)
└── utils/          # Fonctions utilitaires
```

## 🛠️ Technologies Utilisées

- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Typage statique
- **React Navigation** - Navigation
- **React Native Paper** - Composants UI
- **Firebase** - Backend (Auth + Firestore)
- **React Native Gesture Handler** - Gestes
- **React Native Draggable FlatList** - Drag & Drop

## 📋 Roadmap

- [x] Phase 1 : Setup Expo + Firebase SDK
- [x] Phase 2 : Login / Register
- [x] Phase 3 : Liste projets + création
- [x] Phase 4 : Détails projet + Kanban
- [x] Phase 5 : Gestion des tickets
- [ ] Phase 6 : Assignation des tickets
- [ ] Phase 7 : Améliorations UI
- [ ] Phase 8 : Notifications
- [ ] Phase 9 : Tests multi-plateforme

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
