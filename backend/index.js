// Importation des modules
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

// Création de l'application Express
const app = express();
const PORT = 8800;

// ================ CONFIGURATION ================
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================ BASE DE DONNÉES ================
let db;

async function initDatabase() {
    try {
        db = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "73&deluxeQQL5&4",
            database: "goldorak_db",
        });
        console.log('✅ Connexion à la base de données établie');
        return db;
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
        process.exit(1);
    }
}

// ================ MIDDLEWARES ================
const validateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const handleAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ================ ROUTES PERSONNAGES ================
app.get('/api/v1/personnages', handleAsync(async (req, res) => {
    const [rows] = await db.query('SELECT * FROM personnages ORDER BY id');
    res.json(rows);
}));

app.get('/api/v1/personnages/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Personnage non trouvé' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newPersonnage[0]);
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
        return res.status(404).json({ error: 'Personnage non trouvé' });
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(id);
    const query = `UPDATE personnages SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
    res.json(updated[0]);
}));

app.delete('/api/v1/personnages/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM personnages WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Personnage non trouvé' });
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
    res.json(rows);
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
        return res.status(404).json({ error: 'Robot non trouvé' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newRobot[0]);
}));

app.patch('/api/v1/robots/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await db.query(
        'SELECT id FROM robots WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Robot non trouvé' });
    }

    if (updates.pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [updates.pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
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

    res.json(updated[0]);
}));

app.delete('/api/v1/robots/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM robots WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Robot non trouvé' });
    }

    const [armeDeps] = await db.query(
        'SELECT COUNT(*) as count FROM armes WHERE robot_id = ?',
        [id]
    );

    if (armeDeps[0].count > 0) {
        return res.status(400).json({
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
    res.json(rows);
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
        return res.status(404).json({ error: 'Vaisseau non trouvé' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newVaisseau[0]);
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
        return res.status(404).json({ error: 'Vaisseau non trouvé' });
    }

    if (updates.pilote_id) {
        const [pilote] = await db.query(
            'SELECT id FROM personnages WHERE id = ?',
            [updates.pilote_id]
        );

        if (pilote.length === 0) {
            return res.status(400).json({
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
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

    res.json(updated[0]);
}));

app.delete('/api/v1/vaisseaux/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM vaisseaux WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Vaisseau non trouvé' });
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
    res.json(rows);
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
        return res.status(404).json({ error: 'Arme non trouvée' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newArme[0]);
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
        return res.status(404).json({ error: 'Arme non trouvée' });
    }

    if (updates.robot_id) {
        const [robot] = await db.query(
            'SELECT id FROM robots WHERE id = ?',
            [updates.robot_id]
        );

        if (robot.length === 0) {
            return res.status(400).json({
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
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

    res.json(updated[0]);
}));

app.delete('/api/v1/armes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM armes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Arme non trouvée' });
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
    res.json(rows);
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
        return res.status(404).json({ error: 'Monstre non trouvé' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newMonstre[0]);
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
        return res.status(404).json({ error: 'Monstre non trouvé' });
    }

    if (updates.episode_id) {
        const [episode] = await db.query(
            'SELECT id FROM episodes WHERE id = ?',
            [updates.episode_id]
        );

        if (episode.length === 0) {
            return res.status(400).json({
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
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

    res.json(updated[0]);
}));

app.delete('/api/v1/monstres/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT nom_fr FROM monstres WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Monstre non trouvé' });
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
    res.json(rows);
}));

app.get('/api/v1/episodes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Épisode non trouvé' });
    }

    res.json(rows[0]);
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

    res.status(201).json(newEpisode[0]);
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
        return res.status(404).json({ error: 'Épisode non trouvé' });
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
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(id);
    const query = `UPDATE episodes SET ${setClauses.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query(
        'SELECT * FROM episodes WHERE id = ?',
        [id]
    );

    res.json(updated[0]);
}));

app.delete('/api/v1/episodes/:id', handleAsync(async (req, res) => {
    const { id } = req.params;

    const [existing] = await db.query(
        'SELECT titre_fr FROM episodes WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'Épisode non trouvé' });
    }

    // Vérifier si des monstres sont liés à cet épisode
    const [monstreDeps] = await db.query(
        'SELECT COUNT(*) as count FROM monstres WHERE episode_id = ?',
        [id]
    );

    if (monstreDeps[0].count > 0) {
        return res.status(400).json({
            error: `Impossible de supprimer cet épisode car ${monstreDeps[0].count} monstre(s) y sont liés`
        });
    }

    await db.query('DELETE FROM episodes WHERE id = ?', [id]);

    res.json({
        success: true,
        message: `Épisode "${existing[0].titre_fr}" supprimé avec succès`
    });
}));

// ================ GESTION DES ERREURS ================
app.use((err, req, res, next) => {
    console.error('🔥 Erreur serveur:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Erreur de validation',
            details: err.errors
        });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: 'Entrée en double dans la base de données'
        });
    }

    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ================ ROUTE RACINE ================
app.get('/', (req, res) => {
    res.json({
        message: 'API Goldorak - Bienvenue!',
        version: '1.0.0',
        endpoints: {
            personnages: '/api/v1/personnages',
            robots: '/api/v1/robots',
            vaisseaux: '/api/v1/vaisseaux',
            armes: '/api/v1/armes',
            monstres: '/api/v1/monstres',
            episodes: '/api/v1/episodes'
        }
    });
});

// ================ DÉMARRAGE DU SERVEUR ================
async function startServer() {
    await initDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 Serveur Goldorak API démarré sur le port ${PORT}`);
        console.log(`📚 Documentation: http://localhost:${PORT}`);
        console.log('\n📡 Endpoints disponibles:');
        console.log('   GET    /');
        console.log('\n   === CRUD Personnages ===');
        console.log('   GET    /api/v1/personnages');
        console.log('   GET    /api/v1/personnages/:id');
        console.log('   POST   /api/v1/personnages');
        console.log('   PATCH  /api/v1/personnages/:id');
        console.log('   DELETE /api/v1/personnages/:id');
        console.log('\n   === CRUD Robots ===');
        console.log('   GET    /api/v1/robots');
        console.log('   GET    /api/v1/robots/:id');
        console.log('   POST   /api/v1/robots');
        console.log('   PATCH  /api/v1/robots/:id');
        console.log('   DELETE /api/v1/robots/:id');
        console.log('\n   === CRUD Vaisseaux ===');
        console.log('   GET    /api/v1/vaisseaux');
        console.log('   GET    /api/v1/vaisseaux/:id');
        console.log('   POST   /api/v1/vaisseaux');
        console.log('   PATCH  /api/v1/vaisseaux/:id');
        console.log('   DELETE /api/v1/vaisseaux/:id');
        console.log('\n   === CRUD Armes ===');
        console.log('   GET    /api/v1/armes');
        console.log('   GET    /api/v1/armes/:id');
        console.log('   POST   /api/v1/armes');
        console.log('   PATCH  /api/v1/armes/:id');
        console.log('   DELETE /api/v1/armes/:id');
        console.log('\n   === CRUD Monstres ===');
        console.log('   GET    /api/v1/monstres');
        console.log('   GET    /api/v1/monstres/:id');
        console.log('   POST   /api/v1/monstres');
        console.log('   PATCH  /api/v1/monstres/:id');
        console.log('   DELETE /api/v1/monstres/:id');
        console.log('\n   === CRUD Épisodes ===');
        console.log('   GET    /api/v1/episodes');
        console.log('   GET    /api/v1/episodes/:id');
        console.log('   POST   /api/v1/episodes');
        console.log('   PATCH  /api/v1/episodes/:id');
        console.log('   DELETE /api/v1/episodes/:id');
        console.log('\n🌐 Frontend: http://localhost:5173');
        console.log('🔗 API: http://localhost:8800');
    });
}

// Démarrer le serveur
startServer().catch(error => {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
});