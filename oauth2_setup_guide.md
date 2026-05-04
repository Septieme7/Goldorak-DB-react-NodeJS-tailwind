# Configuration OAuth2 — Goldorak Database

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Configuration Google OAuth2](#configuration-google-oauth2)
  - [Étape 1: Créer un projet GCP](#étape-1-créer-un-projet-gcp)
  - [Étape 2: Activer l'API Google+](#étape-2-activer-lapi-google)
  - [Étape 3: Créer les identifiants OAuth2](#étape-3-créer-les-identifiants-oauth2)
  - [Étape 4: Configurer l'écran de consentement](#étape-4-configurer-lécran-de-consentement)
- [Configuration GitHub OAuth2](#configuration-github-oauth2)
  - [Étape 1: Créer une OAuth App](#étape-1-créer-une-oauth-app)
  - [Étape 2: Générer les secrets](#étape-2-générer-les-secrets)
  - [Étape 3: Configurer les URLs](#étape-3-configurer-les-urls-de-callback)
- [Configuration Backend](#configuration-backend)
- [Configuration Frontend](#configuration-frontend)
- [Tests et Dépannage](#tests-et-dépannage)
- [Déploiement Production](#déploiement-production)

---

## Vue d'ensemble

Ce guide vous aide à configurer l'authentification OAuth2 pour le projet Goldorak Database avec:
- Google OAuth2 (via Google Cloud Platform)
- GitHub OAuth2 (via GitHub Developer Settings)

### Flux d'authentification OAuth2

```
Utilisateur clic "Connexion"
         ↓
Frontend React (Login page)
         ↓
Redirection vers backend /auth/google ou /auth/github
         ↓
Backend Express (Passport.js)
         ↓
Redirection vers OAuth provider (Google/GitHub)
         ↓
Authentification utilisateur
         ↓
Callback avec authorization code
         ↓
Échange code → token d'accès
         ↓
Récupération profil utilisateur
         ↓
Génération JWT token
         ↓
Stockage token localStorage (frontend)
         ↓
Application sécurisée
```

---

## Configuration Google OAuth2

### Étape 1: Créer un projet GCP

1. Accédez à [console.cloud.google.com](https://console.cloud.google.com)

2. Connectez-vous avec votre compte Google

3. Créez un nouveau projet
   - Cliquez sur le sélecteur de projets en haut à gauche
   - Cliquez sur "Nouveau projet"
   - Nommez-le: `Goldorak Database`
   - Cliquez sur "Créer"

4. Attendez la création du projet (1-2 minutes)

---

### Étape 2: Activer l'API Google+

1. Allez dans le menu principal → APIs et services → Bibliothèque

2. Recherchez "Google+ API"

3. Cliquez sur le résultat et activez l'API avec le bouton bleu "Activer"

4. Attendez 30 secondes que l'API soit activée

---

### Étape 3: Créer les identifiants OAuth2

1. Allez dans APIs et services → Identifiants

2. Cliquez sur "Créer des identifiants" → "Identifiant OAuth 2.0"

3. Un message vous demande de configurer l'écran de consentement en premier
   - Cliquez sur "Configurer l'écran de consentement"
   - Procédez à l'étape 4 ci-dessous

---

### Étape 4: Configurer l'écran de consentement

1. Sélectionnez le type d'utilisateur
   - Choisissez "Externe" (pour les tests en développement)
   - Cliquez "Créer"

2. Remplissez les informations requises
   - Nom de l'application: `Goldorak Database`
   - Email du support utilisateur: votre@email.com
   - Logo: optionnel
   - Cliquez "Enregistrer et continuer"

3. Ajoutez les scopes (permissions)
   - Cliquez "Ajouter ou supprimer des scopes"
   - Sélectionnez:
     ```
     userinfo.email
     userinfo.profile
     ```
   - Cliquez "Mettre à jour" → "Enregistrer et continuer"

4. Ajoutez des utilisateurs de test
   - Entrez votre adresse email
   - Cliquez "Ajouter"
   - Cliquez "Enregistrer et continuer"

5. Vérification terminée
   - Cliquez "Retour au tableau de bord"

---

### Créer l'identifiant OAuth2

1. Allez dans APIs et services → Identifiants

2. Cliquez "Créer des identifiants" → "Identifiant OAuth 2.0"

3. Sélectionnez "Application Web"

4. Configurez l'application
   - Nom: `Goldorak Backend`
   - URIs JavaScript autorisées:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - URIs de redirection autorisées:
     ```
     http://localhost:8800/api/v1/auth/google/callback
     ```
   - Cliquez "Créer"

5. Copiez vos identifiants
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`
   - Conservez ces valeurs dans un endroit sécurisé

---

## Configuration GitHub OAuth2

### Étape 1: Créer une OAuth App

1. Allez sur [github.com/settings/developers](https://github.com/settings/developers)

2. Sélectionnez "OAuth Apps"

3. Cliquez "New OAuth App"

4. Remplissez les informations
   - Application name: `Goldorak Database`
   - Homepage URL: `http://localhost:5173`
   - Application description: `Full-stack database for Goldorak universe`
   - Authorization callback URL:
     ```
     http://localhost:8800/api/v1/auth/github/callback
     ```
   - Cliquez "Register application"

---

### Étape 2: Générer les secrets

1. Copiez le Client ID depuis la page de l'application

2. Cliquez "Generate a new client secret"

3. Copiez le secret généré (important: ne s'affiche qu'une fois)

---

### Étape 3: Configurer les URLs de callback

Pour développement local:
```
http://localhost:8800/api/v1/auth/github/callback
```

Pour production:
```
https://votre-domaine.com/api/v1/auth/github/callback
```

Les permissions par défaut sont suffisantes (email et profil).

---

## Configuration Backend

### Fichier `backend/.env`

Créez ou mettez à jour le fichier `.env` dans le dossier `backend/`:

```dotenv
# Authentification OAuth2

# Google OAuth2
GOOGLE_CLIENT_ID=xxxxx-yyyyy.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:8800/api/v1/auth/google/callback

# GitHub OAuth2
GITHUB_CLIENT_ID=Ov23lixxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_CALLBACK_URL=http://localhost:8800/api/v1/auth/github/callback

# Sécurité
# Générez avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
SESSION_SECRET=votre_secret_session_tres_long_et_aleatoire
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=goldorak_db
DB_USER=root
DB_PASSWORD=password

# Serveur
PORT=8800
NODE_ENV=development
```

### Fichier `backend/config/passport.js`

Créez le fichier `backend/config/passport.js`:

```javascript
/*
 * Configuration Passport.js pour OAuth2 (Google + GitHub)
 * Ce fichier gère l'authentification avec les stratégies Google et GitHub
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'goldorak_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Stratégie Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    // Vérification utilisateur Google
    async (accessToken, refreshToken, profile, done) => {
      try {
        const connection = await pool.getConnection();

        // Chercher l'utilisateur existant
        const [users] = await connection.query(
          'SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?',
          [profile.id, 'google']
        );

        let user;

        if (users.length === 0) {
          // Nouvel utilisateur: insérer en base
          await connection.query(
            `INSERT INTO users 
             (oauth_id, oauth_provider, email, display_name, photo_url) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              profile.id,
              'google',
              profile.emails[0]?.value || '',
              profile.displayName || '',
              profile.photos[0]?.value || null
            ]
          );

          // Récupérer l'utilisateur créé
          const [newUsers] = await connection.query(
            'SELECT * FROM users WHERE oauth_id = ?',
            [profile.id]
          );
          user = newUsers[0];
        } else {
          // Utilisateur existant: mettre à jour
          user = users[0];
          await connection.query(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
          );
        }

        connection.release();
        return done(null, user);

      } catch (err) {
        console.error('Erreur authentification Google:', err);
        return done(err);
      }
    }
  )
);

// Stratégie GitHub OAuth2
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    // Vérification utilisateur GitHub
    async (accessToken, refreshToken, profile, done) => {
      try {
        const connection = await pool.getConnection();

        // Chercher l'utilisateur existant
        const [users] = await connection.query(
          'SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?',
          [profile.id, 'github']
        );

        let user;

        if (users.length === 0) {
          // Nouvel utilisateur: insérer en base
          await connection.query(
            `INSERT INTO users 
             (oauth_id, oauth_provider, email, display_name, photo_url) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              profile.id,
              'github',
              profile.emails[0]?.value || profile._json?.email || '',
              profile.displayName || profile.username || '',
              profile.photos[0]?.value || null
            ]
          );

          // Récupérer l'utilisateur créé
          const [newUsers] = await connection.query(
            'SELECT * FROM users WHERE oauth_id = ?',
            [profile.id]
          );
          user = newUsers[0];
        } else {
          // Utilisateur existant: mettre à jour
          user = users[0];
          await connection.query(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
          );
        }

        connection.release();
        return done(null, user);

      } catch (err) {
        console.error('Erreur authentification GitHub:', err);
        return done(err);
      }
    }
  )
);

// Sérialisation utilisateur
// Convertit l'objet utilisateur en ID pour la session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisation utilisateur
// Récupère l'objet utilisateur complet à partir de l'ID de session
passport.deserializeUser(async (id, done) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    connection.release();

    if (users.length === 0) {
      return done(null, false);
    }
    done(null, users[0]);
  } catch (err) {
    console.error('Erreur désérialisation:', err);
    done(err);
  }
});

module.exports = passport;
```

---

## Configuration Frontend

### Fichier `frontend/.env`

```dotenv
# API Backend
VITE_API_URL=http://localhost:8800/api/v1
```

### Fichier `frontend/src/components/Login.jsx`

```jsx
/*
 * Page Connexion OAuth2
 * Affiche les boutons de connexion Google et GitHub
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();

  // Vérifier si token existe au montage
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Token existant, rediriger vers app
      navigate('/');
    }
  }, [navigate]);

  // Connexion Google
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Connexion GitHub
  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${apiUrl}/auth/github`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <h1>GOLDORAK DATABASE</h1>
          <p>Authentification Sécurisée OAuth2</p>
        </div>

        <hr className="login-divider" />

        <div className="login-buttons">
          {/* Bouton Google */}
          <button
            className="btn-oauth btn-google"
            onClick={handleGoogleLogin}
            aria-label="Se connecter avec Google"
          >
            <span className="oauth-icon">G</span>
            <span className="oauth-text">Connexion Google</span>
          </button>

          {/* Bouton GitHub */}
          <button
            className="btn-oauth btn-github"
            onClick={handleGithubLogin}
            aria-label="Se connecter avec GitHub"
          >
            <span className="oauth-icon">H</span>
            <span className="oauth-text">Connexion GitHub</span>
          </button>
        </div>

        <div className="login-info">
          <p>Connexion sécurisée via OAuth2</p>
          <p>Vos données ne sont jamais stockées en clair</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Tests et Dépannage

### Tester Google OAuth2

1. Lancez l'application:
   ```bash
   docker compose up -d
   ```

2. Accédez à http://localhost:5173

3. Cliquez sur "Connexion Google"

4. Vous êtes redirigé vers Google
   - Sélectionnez votre compte de test
   - Autorisez les permissions

5. Vérifiez que vous êtes redirigé vers la page d'accueil

### Tester GitHub OAuth2

Même procédure que Google OAuth2.

### Vérifier les logs

```bash
# Afficher les logs du backend
docker compose logs -f backend
```

### Problèmes courants

| Problème | Solution |
|----------|----------|
| Invalid Client ID | Vérifiez GOOGLE_CLIENT_ID dans .env |
| Redirect URI mismatch | L'URI de callback ne correspond pas dans Google Console |
| CORS error | Vérifiez CORS_ORIGIN dans .env du backend |
| Token invalide au callback | Vérifiez JWT_SECRET est défini et identique |
| Database connection error | Vérifiez que MySQL est en ligne avec `docker compose ps` |

---

## Déploiement Production

### Avant de déployer

1. Générez des secrets forts:
   ```bash
   # JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # SESSION_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Mettez à jour les URLs de callback dans Google Console et GitHub:
   - Google: `https://votre-domaine.com/api/v1/auth/google/callback`
   - GitHub: `https://votre-domaine.com/api/v1/auth/github/callback`

3. Mettez à jour les variables d'environnement:
   ```dotenv
   NODE_ENV=production
   FRONTEND_URL=https://votre-domaine.com
   CORS_ORIGIN=https://votre-domaine.com
   GOOGLE_CALLBACK_URL=https://votre-domaine.com/api/v1/auth/google/callback
   GITHUB_CALLBACK_URL=https://votre-domaine.com/api/v1/auth/github/callback
   ```

4. Activez les cookies sécurisés dans backend/index.js:
   ```javascript
   app.use(session({
     secure: true,        // HTTPS seulement
     httpOnly: true,      // Pas accessible en JavaScript
     sameSite: 'strict'   // Protection CSRF
   }));
   ```

5. Vérifiez les domaines autorisés:
   - Google: URIs JavaScript + URIs de redirection
   - GitHub: Homepage URL + Authorization callback URL

---

## Documentation officielle

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Passport.js Documentation](http://www.passportjs.org/)

---

**Configuration OAuth2 terminée. L'authentification sécurisée est prête pour votre application Goldorak Database.**