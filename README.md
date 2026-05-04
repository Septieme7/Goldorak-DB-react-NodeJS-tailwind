# 🤖 Goldorak Database - Base de données complète de l'univers Goldorak

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

Une application web full-stack moderne pour gérer et explorer l'univers de Goldorak (UFO Robot Grendizer). Cette base de données interactive permet de cataloguer et consulter tous les personnages, robots, vaisseaux, armes, épisodes et monstres de la série légendaire.

![Goldorak Banner](./frontend/src/assets/GrendizerLogo.png)

---

## 📑 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🎯 Sections principales](#-sections-principales)
- [🏗️ Architecture du projet](#️-architecture-du-projet)
- [🔧 Technologies utilisées](#-technologies-utilisées)
- [📦 Installation](#-installation)
- [🚀 Démarrage](#-démarrage)
- [🔐 Authentification](#-authentification)
- [📚 Structure de la base de données](#-structure-de-la-base-de-données)
- [🎨 Interface utilisateur](#-interface-utilisateur)
- [🔌 API REST](#-api-rest)
- [⚙️ Configuration](#️-configuration)
- [📝 Scripts disponibles](#-scripts-disponibles)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🎭 Gestion complète des données
- ✅ **CRUD complet** pour toutes les entités (Créer, Lire, Modifier, Supprimer)
- ✅ **Recherche et filtrage** avancés
- ✅ **Validation des données** côté client et serveur
- ✅ **Relations entre entités** (personnages ↔ robots, robots ↔ armes, etc.)
- ✅ **Gestion des doublons** automatique

### 🔐 Authentification OAuth2
- 🔑 **Google OAuth** - Connexion avec compte Google
- 🔑 **GitHub OAuth** - Connexion avec compte GitHub
- 🔑 **JWT Tokens** - Gestion sécurisée des sessions
- 🔑 **Routes protégées** - Accès sécurisé à l'application

### 🎨 Interface moderne
- 🌌 **Design spatial thématique** inspiré de l'univers Goldorak
- 📱 **Responsive Design** - Compatible mobile, tablette et desktop
- 🎯 **Navigation par onglets** intuitive
- 💫 **Animations fluides** et transitions CSS
- 🌈 **Palette de couleurs** cyan, rouge, orange (couleurs iconiques de Goldorak)

### 📊 Tableau de bord
- 📈 **Statistiques en temps réel** du nombre d'entrées par catégorie
- 🔄 **Actualisation automatique** des données
- 🟢 **Statut de l'API** en temps réel
- 👤 **Informations utilisateur** avec photo de profil

---

## 🎯 Sections principales

### 👥 Personnages
Gérez tous les personnages de la série.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🎭 Rôle (Héros, Allié, Antagoniste, etc.)
- 🌍 Faction (Terre, Véga, Neutre)
- 🎂 Âge
- 📄 Description détaillée

**Fonctionnalités :**
- Affichage des badges de faction avec couleurs distinctives
- Tri et recherche par nom
- Vue détaillée avec toutes les informations
- Modification et suppression sécurisées

---

### 🤖 Robots & Méchas
Cataloguez tous les robots de combat.

**Champs disponibles :**
- 📝 Nom français / japonais
- 👤 Pilote (relation avec Personnages)
- 🏷️ Type de robot (Combat, Transformable, Transport, etc.)
- 📏 Hauteur (en mètres)
- ⚖️ Poids (en tonnes)
- 📄 Description complète

**Fonctionnalités :**
- Sélection du pilote avec format "ID X = Nom"
- Types prédéfinis avec dropdown
- Badges colorés par type
- Affichage des spécifications techniques

---

### 🚀 Vaisseaux
Répertoriez tous les vaisseaux spatiaux et terrestres.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🚀 Type (Vaisseau-mère, Croiseur, Submersible, etc.)
- 👤 Pilote (optionnel)
- 🌍 Faction (Terre, Véga, Neutre)
- 📄 Description

**Fonctionnalités :**
- Classification par type avec badges
- Affichage de la faction avec couleurs
- Option "Aucun" pour les vaisseaux automatiques
- Liens avec les personnages pilotes

---

### ⚔️ Armes de Goldorak
Documentez toutes les armes et attaques spéciales.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🤖 Robot associé (relation)
- ⚡ Puissance (texte descriptif)
- 📊 Fréquence d'utilisation (Très Fréquente → Très Rare)
- 📄 Description de l'attaque

**Fonctionnalités :**
- Sélection du robot propriétaire
- Fréquence avec badges colorés :
  - 🔴 Très Fréquente
  - 🟠 Fréquente
  - 🟡 Occasionnelle
  - 🟢 Rare
- Descriptions détaillées avec tooltip

---

### 📺 Épisodes
Suivez tous les épisodes de la série.

**Champs disponibles :**
- 📝 Titre français / japonais
- 🔢 Numéro épisode JP / FR
- 🗓️ Date de diffusion JP / FR
- 📋 Résumé
- 📄 Description complète
- ✅ Statut (Diffusé FR / Non diffusé)

**Fonctionnalités :**
- Calcul automatique de la saison
- Badges de statut de diffusion
- Colonne Description avec aperçu tronqué
- Timeline des diffusions

---

### 🐉 Monstres & Ennemis
Recensez tous les adversaires et monstres.

**Champs disponibles :**
- 📝 Nom français / japonais
- 📺 Épisode d'apparition (relation)
- 🏷️ Type (Monstre, Robot, Vaisseau)
- 📏 Taille (en mètres)
- ⚡ Puissance
- 📄 Description

**Fonctionnalités :**
- Lien avec l'épisode d'apparition
- Classification par type
- Spécifications physiques
- Recherche par épisode

---

## 🏗️ Architecture du projet

```
Crud_Node_react/
│
├── 📁 backend/                    # Serveur Node.js + Express
│   ├── 📁 config/                # Configuration de la base de données
│   │   └── db.js                 # Connexion MySQL
│   │
│   ├── 📁 middlewares/           # Middlewares Express
│   │   ├── auth.js               # Authentification JWT
│   │   └── validation.js         # Validation des données
│   │
│   ├── 📁 routes/                # Routes API REST
│   │   ├── auth.js               # 🔐 Routes d'authentification OAuth2
│   │   ├── personnages.js        # 👥 CRUD Personnages
│   │   ├── robots.js             # 🤖 CRUD Robots
│   │   ├── vaisseaux.js          # 🚀 CRUD Vaisseaux
│   │   ├── armes.js              # ⚔️ CRUD Armes
│   │   ├── episodes.js           # 📺 CRUD Épisodes
│   │   └── monstres.js           # 🐉 CRUD Monstres
│   │
│   ├── 📁 database/              # Scripts SQL
│   │   └── users.sql             # Structure table utilisateurs
│   │
│   ├── .env                      # Variables d'environnement
│   ├── .env.example              # Template de configuration
│   ├── index.js                  # 🚀 Point d'entrée serveur
│   └── package.json              # Dépendances backend
│
├── 📁 frontend/                   # Application React + Vite
│   ├── 📁 public/                # Assets publics
│   │   └── favicon.ico
│   │
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Images et ressources
│   │   │   ├── GrendizerLogo.png
│   │   │   ├── bg_Goldorak.jpeg
│   │   │   └── bg_modal1.jpg
│   │   │
│   │   ├── 📁 components/        # Composants React
│   │   │   ├── Login.jsx         # 🔐 Page de connexion OAuth
│   │   │   ├── AuthCallback.jsx  # Callback OAuth
│   │   │   ├── ProtectedRoute.jsx # Route protégée
│   │   │   ├── Header.jsx        # En-tête avec infos user
│   │   │   ├── Modal.jsx         # Modal CRUD universel
│   │   │   ├── DescriptionCell.jsx # Tooltip descriptions
│   │   │   ├── Personnages.jsx   # 👥 Gestion personnages
│   │   │   ├── Robots.jsx        # 🤖 Gestion robots
│   │   │   ├── Vaisseaux.jsx     # 🚀 Gestion vaisseaux
│   │   │   ├── Armes.jsx         # ⚔️ Gestion armes
│   │   │   ├── Episodes.jsx      # 📺 Gestion épisodes
│   │   │   ├── Monstres.jsx      # 🐉 Gestion monstres
│   │   │   ├── Components.css    # Styles composants
│   │   │   └── Modal.css         # Styles modal
│   │   │
│   │   ├── 📁 context/           # Context API React
│   │   │   └── AuthContext.jsx   # Contexte d'authentification
│   │   │
│   │   ├── 📁 hooks/             # Custom hooks React
│   │   │   ├── useFetchData.js   # Hook CRUD générique
│   │   │   ├── useFormFields.js  # Configuration des formulaires
│   │   │   └── useReferenceData.js # Chargement données référence
│   │   │
│   │   ├── 📁 styles/            # Styles globaux
│   │   │   └── Login.css         # Styles page login
│   │   │
│   │   ├── api.js                # 🔌 Client API REST
│   │   ├── App.jsx               # Composant racine (non utilisé)
│   │   ├── AppWithAuth.jsx       # 🚀 Application principale
│   │   ├── App.css               # Styles application
│   │   ├── index.css             # Styles globaux
│   │   └── main.jsx              # Point d'entrée React
│   │
│   ├── .env                      # Variables d'environnement
│   ├── .env.example              # Template de configuration
│   ├── index.html                # HTML racine
│   ├── vite.config.js            # Configuration Vite
│   └── package.json              # Dépendances frontend
│
├── OAUTH2_SETUP.md               # 📖 Guide configuration OAuth2
└── README.md                     # 📄 Ce fichier
```

---

## 🔧 Technologies utilisées

### Backend
- **Node.js** `>=18.0.0` - Runtime JavaScript
- **Express** `^5.2.1` - Framework web
- **MySQL2** `^3.16.3` - Driver MySQL avec Promises
- **JWT** `^9.0.3` - JSON Web Tokens pour l'authentification
- **Passport** `^0.7.0` - Authentification OAuth2
  - `passport-google-oauth20` - Google OAuth
  - `passport-github2` - GitHub OAuth
- **Express Validator** `^7.3.1` - Validation des données
- **CORS** `^2.8.6` - Cross-Origin Resource Sharing
- **dotenv** `^17.2.3` - Gestion variables d'environnement

### Frontend
- **React** `^19.2.0` - Bibliothèque UI
- **React Router DOM** `^7.13.0` - Routage côté client
- **Vite** `7.2.5` - Build tool ultra-rapide
- **CSS3** - Animations et transitions modernes

### Base de données
- **MySQL** `>=8.0` - SGBD relationnel

---

## 📦 Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ✅ **Node.js** >= 18.0.0 ([Télécharger](https://nodejs.org/))
- ✅ **MySQL** >= 8.0 ([Télécharger](https://dev.mysql.com/downloads/))
- ✅ **Git** ([Télécharger](https://git-scm.com/))

### Étape 1 : Cloner le projet

```bash
git clone <url-du-repo>
cd Crud_Node_react
```

### Étape 2 : Installer les dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### Étape 3 : Configuration de la base de données

1. **Créer la base de données MySQL :**

```sql
CREATE DATABASE goldorak_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE goldorak_db;
```

2. **Créer les tables :**

```sql
-- Table Personnages
CREATE TABLE personnages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    faction VARCHAR(50),
    role VARCHAR(100),
    age INT,
    description TEXT
);

-- Table Robots
CREATE TABLE robots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    pilote_id INT,
    type_robot VARCHAR(100),
    hauteur DECIMAL(5,2),
    poids DECIMAL(6,2),
    description TEXT,
    FOREIGN KEY (pilote_id) REFERENCES personnages(id) ON DELETE SET NULL
);

-- Table Vaisseaux
CREATE TABLE vaisseaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    type_vaisseau VARCHAR(100),
    pilote_id INT,
    faction VARCHAR(50),
    description TEXT,
    FOREIGN KEY (pilote_id) REFERENCES personnages(id) ON DELETE SET NULL
);

-- Table Armes
CREATE TABLE armes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    robot_id INT,
    puissance VARCHAR(100),
    frequence_utilisation VARCHAR(50),
    description TEXT,
    FOREIGN KEY (robot_id) REFERENCES robots(id) ON DELETE CASCADE
);

-- Table Épisodes
CREATE TABLE episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre_fr VARCHAR(200) NOT NULL,
    titre_jp VARCHAR(200),
    numero_fr INT,
    numero_jp INT NOT NULL,
    diffuse_jp DATE,
    diffuse_fr DATE,
    resume TEXT,
    description TEXT
);

-- Table Monstres
CREATE TABLE monstres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    episode_id INT,
    type_monstre VARCHAR(50),
    taille DECIMAL(5,2),
    puissance VARCHAR(100),
    description TEXT,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE SET NULL
);

-- Table Utilisateurs (OAuth)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oauth_id VARCHAR(255) NOT NULL UNIQUE,
    oauth_provider ENUM('google', 'github') NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Étape 4 : Configuration OAuth2

Consultez le fichier `OAUTH2_SETUP.md` pour configurer Google et GitHub OAuth.

**Résumé rapide :**

1. **Google OAuth :**
   - Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
   - Activer l'API Google+
   - Créer des identifiants OAuth 2.0
   - Ajouter les URI de redirection

2. **GitHub OAuth :**
   - Aller dans Settings → Developer settings → OAuth Apps
   - Créer une nouvelle OAuth App
   - Configurer les callback URLs

### Étape 5 : Variables d'environnement

#### Backend `.env`

Copiez `.env.example` vers `.env` et configurez :

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=goldorak_db
DB_PORT=3306

# Serveur
PORT=8800
NODE_ENV=development

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_EXPIRES_IN=7d

# OAuth Google
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8800/api/v1/auth/google/callback

# OAuth GitHub
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8800/api/v1/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=votre_secret_session_super_securise
```

#### Frontend `.env`

Copiez `.env.example` vers `.env` et configurez :

```env
VITE_API_URL=http://localhost:8800/api/v1
```

---

## 🚀 Démarrage

### Mode développement

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:8800`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
L'application démarre sur `http://localhost:5173`

### Mode production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔐 Authentification

### Flux OAuth2

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Clic "Se connecter avec Google/GitHub"
       ▼
┌─────────────────────┐
│   Frontend React    │
│  /login page        │
└──────┬──────────────┘
       │
       │ 2. Redirection vers /api/v1/auth/google (ou /github)
       ▼
┌─────────────────────┐
│   Backend Express   │
│  (Passport.js)      │
└──────┬──────────────┘
       │
       │ 3. Redirection vers Google/GitHub OAuth
       ▼
┌─────────────────────┐
│  Google / GitHub    │
│  OAuth Server       │
└──────┬──────────────┘
       │
       │ 4. Utilisateur s'authentifie
       │ 5. Callback vers backend /auth/callback
       ▼
┌─────────────────────┐
│   Backend Express   │
│  /auth/callback     │
└──────┬──────────────┘
       │
       │ 6. Génération JWT Token
       │ 7. Redirection vers /auth/callback?token=...
       ▼
┌─────────────────────┐
│   Frontend React    │
│  /auth/callback     │
└──────┬──────────────┘
       │
       │ 8. Vérification token
       │ 9. Stockage localStorage
       │ 10. Redirection vers /
       ▼
┌─────────────────────┐
│   Application       │
│   Authentifiée ✅	  │
└─────────────────────┘
```

### Sécurité

- ✅ **Tokens JWT** avec expiration (7 jours par défaut)
- ✅ **Routes protégées** avec middleware d'authentification
- ✅ **CORS configuré** pour empêcher les requêtes non autorisées
- ✅ **Validation des données** côté client et serveur
- ✅ **Sessions sécurisées** avec express-session

---

## 📚 Structure de la base de données

### Schéma relationnel

```
┌─────────────────┐
│  personnages    │
│─────────────────│
│ • id (PK)       │◄────┐
│ • nom_fr        │     │
│ • nom_jp        │     │
│ • faction       │     │
│ • role          │     │
│ • age           │     │
│ • description   │     │
└─────────────────┘     │
                        │ pilote_id (FK)
                        │
┌─────────────────┐     │
│     robots      │     │
│─────────────────│     │
│ • id (PK)       │◄────┼────┐
│ • nom_fr        │     │    │
│ • pilote_id (FK)├─────┘    │
│ • type_robot    │          │
│ • hauteur       │          │
│ • poids         │          │ robot_id (FK)
│ • description   │          │
└─────────────────┘          │
                             │
┌─────────────────┐          │
│      armes      │          │
│─────────────────│          │
│ • id (PK)       │          │
│ • nom_fr        │          │
│ • robot_id (FK) ├──────────┘
│ • puissance     │
│ • frequence     │
│ • description   │
└─────────────────┘

┌─────────────────┐
│    vaisseaux    │
│─────────────────│
│ • id (PK)       │
│ • nom_fr        │
│ • pilote_id (FK)├─────┐
│ • type_vaisseau │     │
│ • faction       │     │
│ • description   │     └──► personnages
└─────────────────┘

┌─────────────────┐
│    episodes     │
│─────────────────│
│ • id (PK)       │◄────┐
│ • titre_fr      │     │
│ • numero_jp     │     │
│ • numero_fr     │     │
│ • diffuse_jp    │     │
│ • diffuse_fr    │     │
│ • resume        │     │ episode_id (FK)
│ • description   │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │
│    monstres     │     │
│─────────────────│     │
│ • id (PK)       │     │
│ • nom_fr        │     │
│ • episode_id(FK)├─────┘
│ • type_monstre  │
│ • taille        │
│ • puissance     │
│ • description   │
└─────────────────┘
users (OAuth2 — table indépendante)
```

---

## 🎨 Interface utilisateur

### Palette de couleurs

```css
--goldorak-space: #0a0a2a      /* Bleu spatial foncé */
--goldorak-blue: #1a4b8c       /* Bleu Goldorak */
--goldorak-red: #ff2e2e        /* Rouge énergétique */
--goldorak-orange: #ff8c00     /* Orange vibrant */
--goldorak-yellow: #ffd700     /* Jaune doré */
--goldorak-energy: #00ffea     /* Cyan électrique */
--goldorak-light: #e0e0e0      /* Gris clair */
--goldorak-silver: #b0b0b0     /* Argent métallique */
```

### Composants principaux

#### 🎯 Modal universel
- Formulaires dynamiques générés automatiquement
- Validation en temps réel
- 3 modes : Créer / Modifier / Voir détails
- Design spatial avec fond d'étoiles
- Animations fluides d'ouverture/fermeture

#### 📊 Tableaux de données
- Tri par colonnes
- Actions rapides (Voir / Modifier / Supprimer)
- Badges colorés pour les catégories
- Descriptions avec tooltip au clic
- Responsive avec scroll horizontal mobile

#### 💬 Tooltip descriptions
- Activation au clic sur texte tronqué
- Affichage centré au premier plan (`z-index: 99999`)
- Fermeture automatique au scroll
- Fermeture par clic sur overlay ou croix
- Texte agrandi pour meilleure lisibilité

#### 🎛️ Dashboard
- Cartes statistiques animées
- Statut API en temps réel
- Actualisation manuelle ou automatique
- Design responsive grid

---

## 🔌 API REST

### Base URL
```
http://localhost:8800/api/v1
```

### Authentification

#### Connexion Google
```
GET /auth/google
```
Redirige vers l'authentification Google OAuth2.

#### Connexion GitHub
```
GET /auth/github
```
Redirige vers l'authentification GitHub OAuth2.

#### Vérifier un token
```
GET /auth/verify
Headers: Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "John Doe",
    "provider": "google"
  }
}
```

### Routes CRUD (Pattern générique)

Toutes les entités suivent le même pattern :

#### Récupérer tous les éléments
```
GET /{entité}
Headers: Authorization: Bearer <token>
```

**Réponse :**
```json
[
  {
    "id": 1,
    "nom_fr": "Actarus",
    "nom_jp": "デューク・フリード",
    ...
  }
]
```

#### Récupérer un élément par ID
```
GET /{entité}/{id}
Headers: Authorization: Bearer <token>
```

#### Créer un élément
```
POST /{entité}
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {JSON avec les champs}
```

#### Modifier un élément (partiel)
```
PATCH /{entité}/{id}
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {JSON avec les champs à modifier}
```

#### Remplacer un élément (complet)
```
PUT /{entité}/{id}
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {JSON complet}
```

#### Supprimer un élément
```
DELETE /{entité}/{id}
Headers: Authorization: Bearer <token>
```

### Entités disponibles

- `/personnages` - 👥 Personnages
- `/robots` - 🤖 Robots
- `/vaisseaux` - 🚀 Vaisseaux
- `/armes` - ⚔️ Armes
- `/episodes` - 📺 Épisodes
- `/monstres` - 🐉 Monstres

### Exemples de requêtes

#### Créer un personnage
```bash
curl -X POST http://localhost:8800/api/v1/personnages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom_fr": "Actarus",
    "nom_jp": "デューク・フリード",
    "faction": "Terre",
    "role": "Héros principal",
    "age": 19,
    "description": "Prince de la planète Euphor..."
  }'
```

#### Modifier un robot
```bash
curl -X PATCH http://localhost:8800/api/v1/robots/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hauteur": 30.5,
    "poids": 280.5
  }'
```

---

## ⚙️ Configuration

### Backend - variables clés

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PORT` | Port du serveur | `8800` |
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_NAME` | Nom base de données | `goldorak_db` |
| `JWT_SECRET` | Secret pour JWT | À définir |
| `JWT_EXPIRES_IN` | Durée validité token | `7d` |
| `FRONTEND_URL` | URL du frontend | `http://localhost:5173` |

### Frontend - variables clés

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL de l'API | `http://localhost:8800/api/v1` |

---

## 📝 Scripts disponibles

### Backend

```bash
# Démarrage mode développement (avec nodemon si configuré)
npm run dev

# Démarrage mode production
npm start

# Tests (à implémenter)
npm test
```

### Frontend

```bash
# Démarrage serveur de développement
npm run dev

# Build pour production
npm run build

# Prévisualisation du build
npm run preview

# Linter analyse statique du code
npm run lint
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guidelines

- 📝 Commentez votre code en français
- ✅ Suivez les conventions de nommage existantes
- 🧪 Testez vos modifications avant de soumettre
- 📚 Mettez à jour la documentation si nécessaire

---

## 📄 Licence

Ce projet est sous licence **ISC**.

---

## 👨‍💻 Auteur

Développé avec ❤️ et beaucoup de ☕ pour les fans de Goldorak.

---

## 🙏 Remerciements

- **Go Nagai** - Créateur de l'univers Goldorak
- **Toei Animation** - Studio d'animation
- Tous les fans qui maintiennent la flamme de cette série légendaire

---

## 📞 Support

Pour toute question ou problème :
- 🐛 Ouvrir une issue sur GitHub
- 📧 Contact : [votre-email]

---

<div align="center">

**⚡ Goldorak, Go! ⚡**

*"Nous sommes tous des enfants des étoiles"*

![Footer](https://img.shields.io/badge/Made%20with-React%20%26%20Express-blue?style=for-the-badge)
![Footer](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge)
![Footer](https://img.shields.io/badge/Auth-OAuth2-green?style=for-the-badge)

</div>
