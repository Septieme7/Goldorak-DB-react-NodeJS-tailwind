// index.js
// Importation des modules
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './middlewares/authMiddleware.js';

// Charger les variables d'environnement
dotenv.config();

// ================ CONFIGURATION ================
const app = express();
const PORT = process.env.PORT || 8800;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ================ MIDDLEWARES ================
app.use(cors({
    origin: process.env.CORS_ORIGIN || FRONTEND_URL,
    credentials: true,
    methods: process.env.CORS_METHODS
        ? process.env.CORS_METHODS.split(',')
        : ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS
        ? process.env.CORS_ALLOWED_HEADERS.split(',')
        : ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware pour forcer l'UTF-8 dans les réponses JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Configuration des sessions pour Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session_tres_securise',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de logging pour le développement
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// ================ BASE DE DONNÉES ================
let db;

async function initDatabase() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.DB_PORT,
            charset: 'utf8mb4'
        });

        // Forcer UTF-8 pour la session MySQL
        await db.query("SET NAMES utf8mb4");
        await db.query("SET CHARACTER SET utf8mb4");

        console.log(`✅ Connexion à la base de données "${process.env.MYSQL_DATABASE || 'goldorak_db'}" établie`);

        // Tester la connexion
        await db.query('SELECT 1');
        console.log('✅ Test de connexion à la base de données réussi');

        return db;
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
        console.error('Configuration utilisée:', {
            host: process.env.DB_HOST,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            port: process.env.DB_PORT
        });

        if (NODE_ENV === 'production') {
            process.exit(1);
        } else {
            throw error;
        }
    }
}

// ================ MIDDLEWARES PERSONNALISÉS ================
const validateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Erreur de validation',
            details: errors.array()
        });
    }
    next();
};

const handleAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ================ ROUTES D'AUTHENTIFICATION ================
app.use('/api/v1/auth', authRoutes);

// ================ PROTECTION DES ROUTES API ================
// Appliquer le middleware d'authentification à toutes les routes /api/v1/* sauf /auth, /health et /easter-egg
app.use('/api/v1', (req, res, next) => {
    if (req.path.startsWith('/auth') || req.path === '/health' || req.path === '/easter-egg') {
        return next();
    }
    requireAuth(req, res, next);
});

// ================ EASTER EGG ROUTE ================
app.post('/api/v1/easter-egg', (req, res) => {
    console.log('🔥 Transfert d\'énergie de la Planète Euphor vers le serveur Node... OK.');
    res.json({ success: true });
});

// ================ ROUTES PERSONNAGES (PROTÉGÉES) ================
app.get('/api/v1/personnages', handleAsync(async (req, res) => {
    const [rows] = await db.query('SELECT * FROM personnages ORDER BY id');
    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/personnages/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Personnage non trouvé'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/personnages', [
    body('nom_fr').notEmpty().trim().withMessage('Le nom français est requis'),
    body('faction').optional().isIn(['Terre', 'Véga', 'Neutre']).withMessage('Faction invalide'),
    body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Âge invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { nom_fr, nom_jp, faction, role, age, description } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM personnages WHERE nom_fr = ?',
        [nom_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `Le personnage "${nom_fr}" existe déjà`
        });
    }

    const [result] = await db.query(
        `INSERT INTO personnages (nom_fr, nom_jp, faction, role, age, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nom_fr.trim(),
            nom_jp?.trim() || null,
            faction?.trim() || null,
            role?.trim() || null,
            age ? parseInt(age) : null,
            description?.trim() || null
        ]
    );

    const [newPersonnage] = await db.query(
        'SELECT * FROM personnages WHERE id = ?',
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Personnage créé avec succès',
        data: newPersonnage[0]
    });
}));

app.patch('/api/v1/personnages/:id', [
    body('faction').optional().isIn(['Terre', 'Véga', 'Neutre']).withMessage('Faction invalide'),
    body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Âge invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM personnages WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Personnage non trouvé'
        });
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['nom_fr', 'nom_jp', 'faction', 'role', 'age', 'description'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(updates[key] !== null && key !== 'age' ? updates[key].toString().trim() : updates[key]);
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE personnages SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

    res.json({
        success: true,
        message: 'Personnage mis à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/personnages/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM personnages WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Personnage non trouvé'
        });
    }

    const [robotDeps] = await db.query(
        'SELECT COUNT(*) as count FROM robots WHERE pilote_id = ?',
        [id]
    );

    const [vaisseauDeps] = await db.query(
        'SELECT COUNT(*) as count FROM vaisseaux WHERE pilote_id = ?',
        [id]
    );

    if (robotDeps[0].count > 0 || vaisseauDeps[0].count > 0) {
        return res.status(400).json({
            success: false,
            error: `Impossible de supprimer ce personnage car il est lié à ${robotDeps[0].count} robot(s) et ${vaisseauDeps[0].count} vaisseau(x)`
        });
    }

    await db.query('DELETE FROM personnages WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Personnage "${existing[0].nom_fr}" supprimé avec succès`
    });
}));

// ================ ROUTES ROBOTS ================
app.get('/api/v1/robots', handleAsync(async (req, res) => {
    const query = `
        SELECT r.*, p.nom_fr as personnage_nom_fr, p.faction as personnage_faction
        FROM robots r
                 LEFT JOIN personnages p ON r.pilote_id = p.id
        ORDER BY r.id
    `;
    const [rows] = await db.query(query);

    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/robots/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT r.*, p.nom_fr as personnage_nom_fr, p.faction as personnage_faction
        FROM robots r
                 LEFT JOIN personnages p ON r.pilote_id = p.id
        WHERE r.id = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Robot non trouvé'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/robots', [
    body('nom_fr').notEmpty().trim().withMessage('Le nom français est requis'),
    body('pilote_id').optional().isInt().withMessage('ID pilote invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { nom_fr, nom_jp, pilote_id, type_robot, hauteur, poids, description } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM robots WHERE nom_fr = ?',
        [nom_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `Le robot "${nom_fr}" existe déjà`
        });
    }

    if (pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le pilote avec ID ${pilote_id} n'existe pas`
            });
        }
    }

    const [result] = await db.query(
        `INSERT INTO robots (nom_fr, nom_jp, pilote_id, type_robot, hauteur, poids, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            nom_fr.trim(),
            nom_jp?.trim() || null,
            pilote_id || null,
            type_robot?.trim() || null,
            hauteur ? parseFloat(hauteur) : null,
            poids ? parseFloat(poids) : null,
            description?.trim() || null
        ]
    );

    const [newRobot] = await db.query(
        `SELECT r.*, p.nom_fr as personnage_nom_fr
         FROM robots r
                  LEFT JOIN personnages p ON r.pilote_id = p.id
         WHERE r.id = ?`,
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Robot créé avec succès',
        data: newRobot[0]
    });
}));

app.patch('/api/v1/robots/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM robots WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Robot non trouvé'
        });
    }

    if (updates.pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [updates.pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le pilote avec ID ${updates.pilote_id} n'existe pas`
            });
        }
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['nom_fr', 'nom_jp', 'pilote_id', 'type_robot', 'hauteur', 'poids', 'description'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(key === 'hauteur' || key === 'poids' ?
                (updates[key] ? parseFloat(updates[key]) : null) :
                (updates[key] !== null ? updates[key].toString().trim() : null));
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE robots SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        `SELECT r.*, p.nom_fr as personnage_nom_fr
         FROM robots r
                  LEFT JOIN personnages p ON r.pilote_id = p.id
         WHERE r.id = ?`,
        [id]
    );

    res.json({
        success: true,
        message: 'Robot mis à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/robots/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM robots WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Robot non trouvé'
        });
    }

    const [armeDeps] = await db.query(
        'SELECT COUNT(*) as count FROM armes WHERE robot_id = ?',
        [id]
    );

    if (armeDeps[0].count > 0) {
        return res.status(400).json({
            success: false,
            error: `Impossible de supprimer ce robot car il est lié à ${armeDeps[0].count} arme(s)`
        });
    }

    await db.query('DELETE FROM robots WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Robot "${existing[0].nom_fr}" supprimé avec succès`
    });
}));

// ================ ROUTES VAISSEAUX ================
app.get('/api/v1/vaisseaux', handleAsync(async (req, res) => {
    const query = `
        SELECT v.*, p.nom_fr as pilote_nom_fr, p.faction as pilote_faction
        FROM vaisseaux v
                 LEFT JOIN personnages p ON v.pilote_id = p.id
        ORDER BY v.id
    `;
    const [rows] = await db.query(query);

    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/vaisseaux/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT v.*, p.nom_fr as pilote_nom_fr, p.faction as pilote_faction
        FROM vaisseaux v
                 LEFT JOIN personnages p ON v.pilote_id = p.id
        WHERE v.id = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Vaisseau non trouvé'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/vaisseaux', [
    body('nom_fr').notEmpty().trim().withMessage('Le nom français est requis'),
    body('pilote_id').optional().isInt().withMessage('ID pilote invalide'),
    body('faction').optional().isIn(['Terre', 'Véga', 'Neutre']).withMessage('Faction invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { nom_fr, nom_jp, type_vaisseau, pilote_id, faction, description } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM vaisseaux WHERE nom_fr = ?',
        [nom_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `Le vaisseau "${nom_fr}" existe déjà`
        });
    }

    if (pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le pilote avec ID ${pilote_id} n'existe pas`
            });
        }
    }

    const [result] = await db.query(
        `INSERT INTO vaisseaux (nom_fr, nom_jp, type_vaisseau, pilote_id, faction, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nom_fr.trim(),
            nom_jp?.trim() || null,
            type_vaisseau?.trim() || null,
            pilote_id || null,
            faction?.trim() || null,
            description?.trim() || null
        ]
    );

    const [newVaisseau] = await db.query(
        `SELECT v.*, p.nom_fr as pilote_nom_fr
         FROM vaisseaux v
                  LEFT JOIN personnages p ON v.pilote_id = p.id
         WHERE v.id = ?`,
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Vaisseau créé avec succès',
        data: newVaisseau[0]
    });
}));

app.patch('/api/v1/vaisseaux/:id', [
    body('faction').optional().isIn(['Terre', 'Véga', 'Neutre']).withMessage('Faction invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM vaisseaux WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Vaisseau non trouvé'
        });
    }

    if (updates.pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [updates.pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le pilote avec ID ${updates.pilote_id} n'existe pas`
            });
        }
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['nom_fr', 'nom_jp', 'type_vaisseau', 'pilote_id', 'faction', 'description'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(updates[key] !== null ? updates[key].toString().trim() : null);
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE vaisseaux SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        `SELECT v.*, p.nom_fr as pilote_nom_fr
         FROM vaisseaux v
                  LEFT JOIN personnages p ON v.pilote_id = p.id
         WHERE v.id = ?`,
        [id]
    );

    res.json({
        success: true,
        message: 'Vaisseau mis à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/vaisseaux/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM vaisseaux WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Vaisseau non trouvé'
        });
    }

    await db.query('DELETE FROM vaisseaux WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Vaisseau "${existing[0].nom_fr}" supprimé avec succès`
    });
}));

// ================ ROUTES ARMES ================
app.get('/api/v1/armes', handleAsync(async (req, res) => {
    const query = `
        SELECT a.*, r.nom_fr as robot_nom_fr, r.type_robot
        FROM armes a
                 LEFT JOIN robots r ON a.robot_id = r.id
        ORDER BY a.id
    `;
    const [rows] = await db.query(query);

    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/armes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT a.*, r.nom_fr as robot_nom_fr, r.type_robot
        FROM armes a
                 LEFT JOIN robots r ON a.robot_id = r.id
        WHERE a.id = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Arme non trouvée'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/armes', [
    body('nom_fr').notEmpty().trim().withMessage('Le nom français est requis'),
    body('robot_id').optional().isInt().withMessage('ID robot invalide'),
    body('frequence_utilisation').optional().isIn(['Très Fréquente', 'Fréquente', 'Occasionnelle', 'Assez Rare', 'Rare', 'Très Rare']).withMessage('Fréquence d\'utilisation invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM armes WHERE nom_fr = ?',
        [nom_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `L'arme "${nom_fr}" existe déjà`
        });
    }

    if (robot_id) {
        const [robot] = await db.query(
            'SELECT id FROM robots WHERE id = ?',
            [robot_id]
        );

        if (robot.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le robot avec ID ${robot_id} n'existe pas`
            });
        }
    }

    const [result] = await db.query(
        `INSERT INTO armes (nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nom_fr.trim(),
            nom_jp?.trim() || null,
            robot_id || null,
            puissance?.trim() || null,
            frequence_utilisation?.trim() || null,
            description?.trim() || null
        ]
    );

    const [newArme] = await db.query(
        `SELECT a.*, r.nom_fr as robot_nom_fr
         FROM armes a
                  LEFT JOIN robots r ON a.robot_id = r.id
         WHERE a.id = ?`,
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Arme créée avec succès',
        data: newArme[0]
    });
}));

app.patch('/api/v1/armes/:id', [
    body('frequence_utilisation').optional().isIn(['Très Fréquente', 'Fréquente', 'Occasionnelle', 'Assez Rare', 'Rare', 'Très Rare']).withMessage('Fréquence d\'utilisation invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM armes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Arme non trouvée'
        });
    }

    if (updates.robot_id) {
        const [robot] = await db.query(
            'SELECT id FROM robots WHERE id = ?',
            [updates.robot_id]
        );

        if (robot.length === 0) {
            return res.status(400).json({
                success: false,
                error: `Le robot avec ID ${updates.robot_id} n'existe pas`
            });
        }
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['nom_fr', 'nom_jp', 'robot_id', 'puissance', 'frequence_utilisation', 'description'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(updates[key] !== null ? updates[key].toString().trim() : null);
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE armes SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        `SELECT a.*, r.nom_fr as robot_nom_fr
         FROM armes a
                  LEFT JOIN robots r ON a.robot_id = r.id
         WHERE a.id = ?`,
        [id]
    );

    res.json({
        success: true,
        message: 'Arme mise à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/armes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM armes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Arme non trouvée'
        });
    }

    await db.query('DELETE FROM armes WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Arme "${existing[0].nom_fr}" supprimée avec succès`
    });
}));

// ================ ROUTES MONSTRES ================
app.get('/api/v1/monstres', handleAsync(async (req, res) => {
    const query = `
        SELECT m.*, e.titre_fr as episode_titre_fr
        FROM monstres m
                 LEFT JOIN episodes e ON m.episode_id = e.id
        ORDER BY m.id
    `;
    const [rows] = await db.query(query);

    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/monstres/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT m.*, e.titre_fr as episode_titre_fr
        FROM monstres m
                 LEFT JOIN episodes e ON m.episode_id = e.id
        WHERE m.id = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Monstre non trouvé'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/monstres', [
    body('nom_fr').notEmpty().trim().withMessage('Le nom français est requis'),
    body('type_monstre').optional().isIn(['Robot', 'Monstre', 'Vaisseau']).withMessage('Type invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM monstres WHERE nom_fr = ?',
        [nom_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `Le monstre "${nom_fr}" existe déjà`
        });
    }

    if (episode_id) {
        const [episode] = await db.query(
            'SELECT id FROM episodes WHERE id = ?',
            [episode_id]
        );

        if (episode.length === 0) {
            return res.status(400).json({
                success: false,
                error: `L'épisode avec ID ${episode_id} n'existe pas`
            });
        }
    }

    const [result] = await db.query(
        `INSERT INTO monstres (nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            nom_fr.trim(),
            nom_jp?.trim() || null,
            episode_id || null,
            description?.trim() || null,
            type_monstre?.trim() || null,
            taille ? parseFloat(taille) : null,
            puissance?.trim() || null
        ]
    );

    const [newMonstre] = await db.query(
        `SELECT m.*, e.titre_fr as episode_titre_fr
         FROM monstres m
                  LEFT JOIN episodes e ON m.episode_id = e.id
         WHERE m.id = ?`,
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Monstre créé avec succès',
        data: newMonstre[0]
    });
}));

app.patch('/api/v1/monstres/:id', [
    body('type_monstre').optional().isIn(['Robot', 'Monstre', 'Vaisseau']).withMessage('Type invalide'),
    validateData
], handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM monstres WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Monstre non trouvé'
        });
    }

    if (updates.episode_id) {
        const [episode] = await db.query(
            'SELECT id FROM episodes WHERE id = ?',
            [updates.episode_id]
        );

        if (episode.length === 0) {
            return res.status(400).json({
                success: false,
                error: `L'épisode avec ID ${updates.episode_id} n'existe pas`
            });
        }
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['nom_fr', 'nom_jp', 'episode_id', 'description', 'type_monstre', 'taille', 'puissance'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(key === 'taille' ?
                (updates[key] ? parseFloat(updates[key]) : null) :
                (updates[key] !== null ? updates[key].toString().trim() : null));
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE monstres SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        `SELECT m.*, e.titre_fr as episode_titre_fr
         FROM monstres m
                  LEFT JOIN episodes e ON m.episode_id = e.id
         WHERE m.id = ?`,
        [id]
    );

    res.json({
        success: true,
        message: 'Monstre mis à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/monstres/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM monstres WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Monstre non trouvé'
        });
    }

    await db.query('DELETE FROM monstres WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Monstre "${existing[0].nom_fr}" supprimé avec succès`
    });
}));

// ================ ROUTES ÉPISODES ================
app.get('/api/v1/episodes', handleAsync(async (req, res) => {
    const [rows] = await db.query('SELECT * FROM episodes ORDER BY numero_fr');

    res.json({
        success: true,
        count: rows.length,
        data: rows
    });
}));

app.get('/api/v1/episodes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Épisode non trouvé'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
}));

app.post('/api/v1/episodes', [
    body('titre_fr').notEmpty().trim().withMessage('Le titre français est requis'),
    body('numero_fr').optional().isInt({ min: 1 }).withMessage('Le numéro français doit être un entier positif'),
    body('numero_jp').optional().isInt({ min: 1 }).withMessage('Le numéro japonais doit être un entier positif'),
    validateData
], handleAsync(async (req, res) => {
    const { titre_fr, titre_jp, numero_fr, numero_jp, diffuse_jp, diffuse_fr, resume } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM episodes WHERE titre_fr = ? AND numero_fr = ?',
        [titre_fr, numero_fr]
    );

    if (existing.length > 0) {
        return res.status(409).json({
            success: false,
            error: `Un épisode avec le même titre et numéro existe déjà`
        });
    }

    const [result] = await db.query(
        `INSERT INTO episodes (titre_fr, titre_jp, numero_fr, numero_jp, diffuse_jp, diffuse_fr, resume)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            titre_fr.trim(),
            titre_jp?.trim() || null,
            numero_fr ? parseInt(numero_fr) : null,
            numero_jp ? parseInt(numero_jp) : null,
            diffuse_jp || null,
            diffuse_fr || null,
            resume?.trim() || null
        ]
    );

    const [newEpisode] = await db.query(
        'SELECT * FROM episodes WHERE id = ?',
        [result.insertId]
    );

    res.status(201).json({
        success: true,
        message: 'Épisode créé avec succès',
        data: newEpisode[0]
    });
}));

app.patch('/api/v1/episodes/:id', [
    body('numero_fr').optional().isInt({ min: 1 }).withMessage('Le numéro français doit être un entier positif'),
    body('numero_jp').optional().isInt({ min: 1 }).withMessage('Le numéro japonais doit être un entier positif'),
    validateData
], handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM episodes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Épisode non trouvé'
        });
    }

    const setClauses = [];
    const values = [];
    const allowedFields = ['titre_fr', 'titre_jp', 'numero_fr', 'numero_jp', 'diffuse_jp', 'diffuse_fr', 'resume'];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(key === 'numero_fr' || key === 'numero_jp' ?
                (updates[key] ? parseInt(updates[key]) : null) :
                (updates[key] !== null ? updates[key].toString().trim() : null));
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Aucune donnée à mettre à jour'
        });
    }

    values.push(id);
    const query = `UPDATE episodes SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        'SELECT * FROM episodes WHERE id = ?',
        [id]
    );

    res.json({
        success: true,
        message: 'Épisode mis à jour avec succès',
        data: updated[0]
    });
}));

app.delete('/api/v1/episodes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT titre_fr FROM episodes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'Épisode non trouvé'
        });
    }

    // Vérifier si des monstres sont liés à cet épisode
    const [monstreDeps] = await db.query(
        'SELECT COUNT(*) as count FROM monstres WHERE episode_id = ?',
        [id]
    );

    if (monstreDeps[0].count > 0) {
        return res.status(400).json({
            success: false,
            error: `Impossible de supprimer cet épisode car ${monstreDeps[0].count} monstre(s) y sont liés`
        });
    }

    await db.query('DELETE FROM episodes WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Épisode "${existing[0].titre_fr}" supprimé avec succès`
    });
}));

// ================ STATISTIQUES ================
app.get('/api/v1/stats', handleAsync(async (req, res) => {
    try {
        const [personnages] = await db.query('SELECT COUNT(*) as count FROM personnages');
        const [robots] = await db.query('SELECT COUNT(*) as count FROM robots');
        const [armes] = await db.query('SELECT COUNT(*) as count FROM armes');
        const [episodes] = await db.query('SELECT COUNT(*) as count FROM episodes');
        const [monstres] = await db.query('SELECT COUNT(*) as count FROM monstres');
        const [vaisseaux] = await db.query('SELECT COUNT(*) as count FROM vaisseaux');

        res.json({
            success: true,
            data: {
                personnages: personnages[0].count,
                robots: robots[0].count,
                armes: armes[0].count,
                episodes: episodes[0].count,
                monstres: monstres[0].count,
                vaisseaux: vaisseaux[0].count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors du calcul des statistiques'
        });
    }
}));

// ================ ROUTE DE SANTÉ ================
app.get('/api/v1/health', handleAsync(async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.json({
            success: true,
            status: 'online',
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: NODE_ENV,
            version: process.env.APP_VERSION || '7.7.7'
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'offline',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
}));

// ================ ROUTE RACINE ================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: `API ${process.env.APP_NAME || 'Goldorak'} - Bienvenue!`,
        version: process.env.APP_VERSION || '7.7.7',
        environment: NODE_ENV,
        endpoints: {
            personnages: '/api/v1/personnages',
            robots: '/api/v1/robots',
            vaisseaux: '/api/v1/vaisseaux',
            armes: '/api/v1/armes',
            monstres: '/api/v1/monstres',
            episodes: '/api/v1/episodes',
            stats: '/api/v1/stats',
            health: '/api/v1/health'
        },
        documentation: `http://localhost:${PORT}`,
        frontend: FRONTEND_URL
    });
});

// ================ GESTION DES ERREURS ================
app.use((err, req, res, next) => {
    console.error(`🔥 Erreur serveur [${new Date().toISOString()}]:`, err);

    if (NODE_ENV === 'development') {
        console.error('Stack trace:', err.stack);
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Erreur de validation',
            details: err.errors
        });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: 'Entrée en double dans la base de données'
        });
    }

    // Erreur MySQL
    if (err.code?.startsWith('ER_')) {
        return res.status(500).json({
            success: false,
            error: 'Erreur de base de données',
            message: NODE_ENV === 'development' ? err.message : 'Erreur interne'
        });
    }

    res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        message: NODE_ENV === 'development' ? err.message : undefined
    });
});

// ================ ROUTE 404 ================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée',
        requestedUrl: req.originalUrl
    });
});

// ================ DÉMARRAGE DU SERVEUR ================
async function startServer() {
    try {
        await initDatabase();

        // Configurer Passport après l'initialisation de la base de données
        configurePassport(db);

        app.listen(PORT, () => {
            const apiBase = `http://localhost:${PORT}/api/v1`;

            console.log(`\n✨ ${process.env.APP_NAME || 'Goldorak API'} v${process.env.APP_VERSION || '7.7.7'}`);
            console.log(`📍 Port: ${PORT} | Env: ${NODE_ENV} | DB: ${process.env.MYSQL_DATABASE || 'goldorak_db'}`);
            console.log(`🔗 Frontend: ${FRONTEND_URL}`);
            console.log(`📅 ${new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' })}`);
            console.log('━'.repeat(50));

            const endpoints = {
                '👥 Personnages': [
                    `GET    ${apiBase}/personnages`,
                    `GET    ${apiBase}/personnages/:id`,
                    `POST   ${apiBase}/personnages`,
                    `PATCH  ${apiBase}/personnages/:id`,
                    `DELETE ${apiBase}/personnages/:id`
                ],
                '🤖 Robots': [
                    `GET    ${apiBase}/robots`,
                    `GET    ${apiBase}/robots/:id`,
                    `POST   ${apiBase}/robots`,
                    `PATCH  ${apiBase}/robots/:id`,
                    `DELETE ${apiBase}/robots/:id`
                ],
                '🚀 Vaisseaux': [
                    `GET    ${apiBase}/vaisseaux`,
                    `GET    ${apiBase}/vaisseaux/:id`,
                    `POST   ${apiBase}/vaisseaux`,
                    `PATCH  ${apiBase}/vaisseaux/:id`,
                    `DELETE ${apiBase}/vaisseaux/:id`
                ],
                '⚔️ Armes': [
                    `GET    ${apiBase}/armes`,
                    `GET    ${apiBase}/armes/:id`,
                    `POST   ${apiBase}/armes`,
                    `PATCH  ${apiBase}/armes/:id`,
                    `DELETE ${apiBase}/armes/:id`
                ],
                '🐉 Monstres': [
                    `GET    ${apiBase}/monstres`,
                    `GET    ${apiBase}/monstres/:id`,
                    `POST   ${apiBase}/monstres`,
                    `PATCH  ${apiBase}/monstres/:id`,
                    `DELETE ${apiBase}/monstres/:id`
                ],
                '📺 Épisodes': [
                    `GET    ${apiBase}/episodes`,
                    `GET    ${apiBase}/episodes/:id`,
                    `POST   ${apiBase}/episodes`,
                    `PATCH  ${apiBase}/episodes/:id`,
                    `DELETE ${apiBase}/episodes/:id`
                ],
                '📊 Utilitaires': [
                    `GET    ${apiBase}/health`,
                    `GET    ${apiBase}/stats`,
                    `GET    http://localhost:${PORT}`
                ]
            };

            Object.entries(endpoints).forEach(([category, routes]) => {
                console.log(`\n${category}:`);
                routes.forEach(route => console.log(`  ${route}`));
            });

            console.log('━'.repeat(50));
            console.log(`✅ ${Object.values(endpoints).flat().length} routes disponibles`);
            console.log(`🚀 Serveur opérationnel sur http://localhost:${PORT}`);
            console.log(`📋 Documentation complète: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage:', error);
        process.exit(1);
    }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
    console.log('🛑 Réception du signal SIGTERM, arrêt en cours...');
    if (db) {
        await db.end();
        console.log('✅ Connexion à la base de données fermée');
    }
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 Réception du signal SIGINT (Ctrl+C), arrêt en cours...');
    if (db) {
        await db.end();
        console.log('✅ Connexion à la base de données fermée');
    }
    process.exit(0);
});

// Démarrer le serveur
startServer().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});