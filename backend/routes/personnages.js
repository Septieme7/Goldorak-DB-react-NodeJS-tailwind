import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();

// Initialiser la connexion à la base de données
let db;

export default function(dbConnection) {
    db = dbConnection;

    // Routes CRUD pour Personnages

    // GET - Récupérer tous les personnages
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT p.*, 
                       COUNT(DISTINCT r.id) as nb_robots,
                       COUNT(DISTINCT v.id) as nb_vaisseaux
                FROM personnages p
                LEFT JOIN robots r ON p.id = r.pilote_id
                LEFT JOIN vaisseaux v ON p.id = v.pilote_id
                GROUP BY p.id
                ORDER BY p.nom_fr ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer un personnage par ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Récupérer le personnage
            const [personnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

            if (personnage.length === 0) {
                return res.status(404).json({ error: "Personnage non trouvé" });
            }

            // Récupérer les robots pilotés
            const [robots] = await db.query(
                'SELECT id, nom_fr, nom_jp FROM robots WHERE pilote_id = ?',
                [id]
            );

            // Récupérer les vaisseaux pilotés
            const [vaisseaux] = await db.query(
                'SELECT id, nom_fr, nom_jp, type_vaisseau FROM vaisseaux WHERE pilote_id = ?',
                [id]
            );

            return res.json({
                ...personnage[0],
                robots,
                vaisseaux
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer un nouveau personnage
    router.post('/', async (req, res) => {
        try {
            const { nom_fr, nom_jp, role, planete_origine } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'personnages',
                ['nom_fr', 'nom_jp'],
                [nom_fr, nom_jp]
            );

            if (doublons.length > 0) {
                return res.status(409).json({
                    error: "Doublon détecté",
                    details: doublons
                });
            }

            // Insertion
            const [result] = await db.query(
                `INSERT INTO personnages (nom_fr, nom_jp, role, planete_origine) 
                 VALUES (?, ?, ?, ?)`,
                [nom_fr, nom_jp || null, role || null, planete_origine || null]
            );

            // Récupérer le personnage créé
            const [newPersonnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [result.insertId]);

            return res.status(201).json({
                message: "Personnage créé avec succès",
                data: newPersonnage[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement un personnage
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'role', 'planete_origine']);

            // Vérifier si le personnage existe
            const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Personnage non trouvé" });
            }

            // Vérifier les doublons si nom_fr ou nom_jp sont modifiés
            if (updates.nom_fr || updates.nom_jp) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'personnages',
                    updates.nom_fr ? ['nom_fr'] : updates.nom_jp ? ['nom_jp'] : [],
                    updates.nom_fr ? [updates.nom_fr] : updates.nom_jp ? [updates.nom_jp] : [],
                    id
                );

                if (doublons.length > 0) {
                    return res.status(409).json({
                        error: "Doublon détecté",
                        details: doublons
                    });
                }
            }

            // Construire la requête de mise à jour
            const fieldsToUpdate = [];
            const values = [];

            Object.keys(updates).forEach(field => {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(updates[field]);
            });

            if (fieldsToUpdate.length === 0) {
                return res.status(400).json({ error: "Aucun champ valide à mettre à jour" });
            }

            values.push(id);

            const [result] = await db.query(
                `UPDATE personnages SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer le personnage mis à jour
            const [updatedPersonnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

            return res.json({
                message: "Personnage mis à jour avec succès",
                data: updatedPersonnage[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement un personnage
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { nom_fr, nom_jp, role, planete_origine } = req.body;

            // Vérifier si le personnage existe
            const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Personnage non trouvé" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'personnages',
                ['nom_fr', 'nom_jp'],
                [nom_fr, nom_jp],
                id
            );

            if (doublons.length > 0) {
                return res.status(409).json({
                    error: "Doublon détecté",
                    details: doublons
                });
            }

            // Mise à jour complète
            const [result] = await db.query(
                `UPDATE personnages 
                 SET nom_fr = ?, nom_jp = ?, role = ?, planete_origine = ?
                 WHERE id = ?`,
                [nom_fr, nom_jp || null, role || null, planete_origine || null, id]
            );

            // Récupérer le personnage mis à jour
            const [updatedPersonnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);

            return res.json({
                message: "Personnage remplacé avec succès",
                data: updatedPersonnage[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer un personnage
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si le personnage existe
            const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Personnage non trouvé" });
            }

            // Vérifier s'il est pilote de robots ou vaisseaux
            const [robots] = await db.query('SELECT id FROM robots WHERE pilote_id = ?', [id]);
            const [vaisseaux] = await db.query('SELECT id FROM vaisseaux WHERE pilote_id = ?', [id]);

            if (robots.length > 0 || vaisseaux.length > 0) {
                return res.status(400).json({
                    error: "Impossible de supprimer ce personnage",
                    details: {
                        robots: robots.length > 0 ? "Ce personnage pilote des robots" : null,
                        vaisseaux: vaisseaux.length > 0 ? "Ce personnage pilote des vaisseaux" : null
                    }
                });
            }

            await db.query('DELETE FROM personnages WHERE id = ?', [id]);

            return res.json({
                message: "Personnage supprimé avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Rechercher des personnages
    router.get('/recherche/:terme', async (req, res) => {
        try {
            const { terme } = req.params;
            const searchTerm = `%${terme}%`;

            const [result] = await db.query(
                `SELECT * FROM personnages 
                 WHERE nom_fr LIKE ? 
                    OR nom_jp LIKE ? 
                    OR role LIKE ? 
                    OR planete_origine LIKE ?
                 ORDER BY nom_fr ASC`,
                [searchTerm, searchTerm, searchTerm, searchTerm]
            );

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un nom existe déjà
    router.get('/verifier-nom/:nom', async (req, res) => {
        try {
            const nom = req.params.nom;

            // Vérifier dans nom_fr
            const [resultFr] = await db.query(
                'SELECT id, nom_fr FROM personnages WHERE nom_fr = ?',
                [nom]
            );

            // Vérifier dans nom_jp
            const [resultJp] = await db.query(
                'SELECT id, nom_jp FROM personnages WHERE nom_jp = ?',
                [nom]
            );

            const existe = resultFr.length > 0 || resultJp.length > 0;

            return res.json({
                existe: existe,
                details: {
                    dans_nom_fr: resultFr.length > 0 ? resultFr[0] : null,
                    dans_nom_jp: resultJp.length > 0 ? resultJp[0] : null
                }
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Statistiques des personnages
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_personnages,
                    COUNT(DISTINCT planete_origine) as total_planetes,
                    SUM(CASE WHEN role LIKE '%pilote%' OR role LIKE '%Pilote%' THEN 1 ELSE 0 END) as total_pilotes
                FROM personnages
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    return router;
}