# Cahier des charges – Frontend MVP Jokkere (React Native + Expo + Firebase)

---

## 1. Objectif du frontend
Créer une interface mobile + web (via Expo Web) pour :  
- Authentification des utilisateurs.  
- Gestion et affichage des projets.  
- Gestion et visualisation des tickets dans un tableau Kanban.  
- Interaction avec Firebase pour lecture/écriture des données.  
- Notifications locales (optionnel MVP).  

---

## 2. Technologies frontend
- **React Native + Expo** → application mobile + web.  
- **React Navigation** → navigation stack et tabs.  
- **UI Library** : React Native Paper / Native Base.  
- **State management** : Context API ou Zustand / Redux.  
- **Firebase SDK** → Auth, Firestore, Storage.  
- **Expo Notifications** → notifications locales (optionnel).  

---

## 3. Écrans et composants principaux

| Écran / Composant       | Description | Fonctionnalités |
|-------------------------|------------|----------------|
| **Login / Register**    | Connexion et création de compte | Formulaire email/mot de passe, validation Firebase, redirection vers liste projets |
| **Liste projets**       | Affichage des projets de l’utilisateur | Liste scrollable, bouton créer projet, navigation vers détails projet |
| **Détails projet**      | Vue Kanban des tickets d’un projet | Colonnes : To Do, In Progress, Done ; tickets draggable ; ajouter/modifier/supprimer tickets |
| **Formulaire ticket**   | Ajouter ou modifier un ticket | Champs : titre, description, assignee, statut |
| **Profil utilisateur**  | Informations utilisateur | Voir email, nom, option logout |
| **Notifications (optionnel)** | Alertes locales | Notification quand ticket assigné |

---

## 4. Navigation
- **Stack navigation** : Login → Register → Projects → ProjectDetails → TicketForm → Profil.  
- **Tab navigation (optionnel)** : Accès rapide entre Projets / Profil / Notifications.  

---

## 5. Architecture et organisation frontend

/src
/components # Composants réutilisables (cards, buttons, headers)
/screens # Écrans principaux (Login, Projects, ProjectDetails, TicketForm)
/navigation # React Navigation Stack et Tabs
/services # Services Firebase (Auth, Firestore)
/context # State Management (Context API ou Zustand)
/utils # Fonctions utilitaires



- **UI** : composants prêts à l’emploi pour accélérer le dev.  
- **State management** : stocker utilisateur courant, projets et tickets dans contexte ou store global.  
- **Data fetching** : Firestore `onSnapshot` pour mises à jour en temps réel.  

---

## 6. Interactions utilisateur
1. Login / Register → Firebase Auth → redirection vers liste projets.  
2. Créer projet → Firestore `/projects` → mise à jour liste.  
3. Voir tickets d’un projet → Kanban avec colonnes → drag & drop pour changer statut.  
4. Ajouter / Modifier ticket → formulaire → sauvegarde Firestore.  
5. Assignation ticket → sélection d’un membre du projet.  
6. Notifications (optionnel) → push local quand ticket assigné.  

---

## 7. UI / UX guidelines
- Interface simple et épurée (style Jira light).  
- Feedback visuel pour toutes actions (loader, succès/erreur).  
- Responsive : mobile + web (Expo Web).  
- Couleurs différentes pour chaque colonne Kanban.  
- Drag & drop fluide (`react-native-draggable-flatlist` ou `react-native-gesture-handler`).  
Palette couleurs “Africain moderne”
Couleur	Hex	Usage
Ocre chaud	#D97706	Accent / boutons / titres
Terracotta doux	#F97316	Background secondaire / highlights
Vert feuille	#16A34A	Succès / validation / bordures
Sable clair	#FDE68A	Fond clair / cartes / colonnes Kanban
Brun profond	#4B2E2E	Texte principal / titres secondaires
Gris chaud	#A3A3A3	Texte secondaire / bordures / placeholders
---

## 8. Roadmap frontend MVP

| Phase | Tâches |
|-------|--------|
| **Phase 1** | Setup Expo + Firebase SDK, config navigation, créer structure dossier |
| **Phase 2** | Login / Register → Auth Firebase |
| **Phase 3** | Liste projets + créer projet |
| **Phase 4** | Détails projet + tickets affichage Kanban |
| **Phase 5** | Ajouter / modifier / supprimer ticket |
| **Phase 6** | Assignation ticket, filtrage tickets par utilisateur |
| **Phase 7** | UI amélioration (React Native Paper, couleurs, responsive) |
| **Phase 8** | Notifications locales (optionnel) |
| **Phase 9** | Test multi-plateforme (iOS, Android, Web) |

---

## 9. Améliorations futures (frontend)
- Drag & drop multi-colonne avancé avec animation.  
- Recherche / filtre tickets par statut, priorité, assignee.  
- Dashboard avec statistiques (tickets ouverts, en retard…).  
- Mode offline + synchronisation Firestore.  
- Thème clair / sombre.  