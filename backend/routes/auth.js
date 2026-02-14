// routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Fonction pour générer un JWT
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            displayName: user.display_name,
            provider: user.oauth_provider
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// ==================== GOOGLE AUTH ====================

// Initier l'authentification Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Callback Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
    (req, res) => {
        // Générer un JWT
        const token = generateToken(req.user);

        // Rediriger vers le frontend avec le token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// ==================== GITHUB AUTH ====================

// Initier l'authentification GitHub
router.get('/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

// Callback GitHub
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
    (req, res) => {
        // Générer un JWT
        const token = generateToken(req.user);

        // Rediriger vers le frontend avec le token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// ==================== UTILITAIRES ====================

// Vérifier le token JWT
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Token manquant'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token invalide ou expiré'
        });
    }
});

// Récupérer les informations de l'utilisateur connecté
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Non authentifié'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                displayName: decoded.displayName,
                provider: decoded.provider
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token invalide'
        });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Erreur lors de la déconnexion'
            });
        }
        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    });
});

export default router;
