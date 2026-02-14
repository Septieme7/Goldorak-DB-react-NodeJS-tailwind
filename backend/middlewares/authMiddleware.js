// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';

/**
 * Middleware pour vérifier le JWT et protéger les routes
 */
export function requireAuth(req, res, next) {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Accès non autorisé - Token manquant'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Ajouter les informations de l'utilisateur à la requête
        req.user = {
            id: decoded.id,
            email: decoded.email,
            displayName: decoded.displayName,
            provider: decoded.provider
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expiré - Veuillez vous reconnecter'
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Token invalide'
        });
    }
}

/**
 * Middleware optionnel - ajoute les infos utilisateur si le token est présent
 * mais ne bloque pas l'accès
 */
export function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                displayName: decoded.displayName,
                provider: decoded.provider
            };
        } catch (error) {
            // On ignore les erreurs et on continue sans utilisateur
        }
    }

    next();
}
