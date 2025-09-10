# Configuration Firebase

Ce dossier contient la configuration Firebase pour l'application Jokkere.

## Fichiers de configuration

### `firebase.json`
Configuration principale Firebase incluant :
- Règles Firestore
- Index Firestore
- Configuration Hosting
- Configuration Emulators

### `firestore.rules`
Règles de sécurité Firestore définissant les permissions d'accès aux collections :
- **users** : Accessible à l'utilisateur lui-même
- **projects** : Accessible aux membres et utilisateurs invités
- **tickets** : Accessible aux membres du projet
- **teamGroups** : Accessible aux membres et utilisateurs invités
- **notifications** : Accessible à l'utilisateur concerné
- **comments** : Accessible aux membres du projet
- **invitations** : Accessible à l'expéditeur et au destinataire

### `firestore.indexes.json`
Index Firestore pour optimiser les requêtes :
- Index sur `members` pour les projets et groupes
- Index sur `projectId` et `status` pour les tickets
- Index sur `email` et `status` pour les invitations

### `.firebaserc`
Configuration du projet Firebase (jokkere-mvp)

## Commandes utiles

### Déployer les règles Firestore
```bash
firebase deploy --only firestore:rules
```

### Déployer les index Firestore
```bash
firebase deploy --only firestore:indexes
```

### Déployer tout
```bash
firebase deploy
```

### Démarrer les émulateurs
```bash
firebase emulators:start
```

## Sécurité

Les règles Firestore sont conçues pour :
1. Permettre aux utilisateurs invités de s'ajouter aux projets/groupes
2. Restreindre l'accès aux données sensibles
3. Assurer la cohérence des permissions entre les collections
4. Optimiser les performances avec des index appropriés
