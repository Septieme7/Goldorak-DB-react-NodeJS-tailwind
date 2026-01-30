import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();

export default function(dbConnection) {
    const db = dbConnection;

    // Routes CRUD pour Robots

    // GET - Récupérer tous les robots avec leurs pilotes
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT r.*, 
                       p.nom_fr as pilote_nom_fr,
                       p.nom_jp as pilote_nom_jp,
                       COUNT(a.id) as nombre_armes
                FROM robots r
                LEFT JOIN personnages p ON r.pilote_id = p.id
                LEFT JOIN armes a ON r.id = a.robot_id
                GROUP BY r.id
                ORDER BY r.nom_fr ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer un robot par ID avec détails complets
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Récupérer le robot avec son pilote
            const [robot] = await db.query(`
                SELECT r.*, p.nom_fr as pilote_nom_fr, p.nom_jp as pilote_nom_jp
                FROM robots r
                LEFT JOIN personnages p ON r.pilote_id = p.id
                WHERE r.id = ?
            `, [id]);

            if (robot.length === 0) {
                return res.status(404).json({ error: "Robot non trouvé" });
            }

            // Récupérer les armes du robot
            const [armes] = await db.query(
                'SELECT id, nom_fr, nom_jp, puissance, frequence_utilisation FROM armes WHERE robot_id = ?',
                [id]
            );

            return res.json({
                ...robot[0],
                armes
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer un nouveau robot
    router.post('/', async (req, res) => {
        try {
            const { nom_fr, nom_jp, pilote_id, description } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier si le pilote existe (si pilote_id est fourni)
            if (pilote_id) {
                await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'robots',
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
                `INSERT INTO robots (nom_fr, nom_jp, pilote_id, description) 
                 VALUES (?, ?, ?, ?)`,
                [nom_fr, nom_jp || null, pilote_id || null, description || null]
            );

            // Récupérer le robot créé
            const [newRobot] = await db.query(`
                SELECT r.*, p.nom_fr as pilote_nom_fr 
                FROM robots r
                LEFT JOIN personnages p ON r.pilote_id = p.id
                WHERE r.id = ?
            `, [result.insertId]);

            return res.status(201).json({
                message: "Robot créé avec succès",
                data: newRobot[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement un robot
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'pilote_id', 'description']);

            // Vérifier si le robot existe
            const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Robot non trouvé" });
            }

            // Vérifier si le pilote existe (si pilote_id est modifié)
            if (updates.pilote_id) {
                await validerIdExistant(db, 'personnages', updates.pilote_id, 'Personnage');
            }

            // Vérifier les doublons si nom_fr ou nom_jp sont modifiés
            if (updates.nom_fr || updates.nom_jp) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'robots',
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
                `UPDATE robots SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer le robot mis à jour
            const [updatedRobot] = await db.query(`
                SELECT r.*, p.nom_fr as pilote_nom_fr 
                FROM robots r
                LEFT JOIN personnages p ON r.pilote_id = p.id
                WHERE r.id = ?
            `, [id]);

            return res.json({
                message: "Robot mis à jour avec succès",
                data: updatedRobot[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement un robot
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { nom_fr, nom_jp, pilote_id, description } = req.body;

            // Vérifier si le robot existe
            const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Robot non trouvé" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier si le pilote existe (si pilote_id est fourni)
            if (pilote_id) {
                await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'robots',
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
                `UPDATE robots 
                 SET nom_fr = ?, nom_jp = ?, pilote_id = ?, description = ?
                 WHERE id = ?`,
                [nom_fr, nom_jp || null, pilote_id || null, description || null, id]
            );

            // Récupérer le robot mis à jour
            const [updatedRobot] = await db.query(`
                SELECT r.*, p.nom_fr as pilote_nom_fr 
                FROM robots r
                LEFT JOIN personnages p ON r.pilote_id = p.id
                WHERE r.id = ?
            `, [id]);

            return res.json({
                message: "Robot remplacé avec succès",
                data: updatedRobot[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer un robot
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si le robot existe
            const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Robot non trouvé" });
            }

            // Vérifier s'il a des armes associées
            const [armes] = await db.query('SELECT id FROM armes WHERE robot_id = ?', [id]);

            if (armes.length > 0) {
                return res.status(400).json({
                    error: "Impossible de supprimer ce robot",
                    details: {
                        armes: `Ce robot a ${armes.length} arme(s) associée(s). Supprimez d'abord les armes.`
                    }
                });
            }

            await db.query('DELETE FROM robots WHERE id = ?', [id]);

            return res.json({
                message: "Robot supprimé avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Robots par pilote
    router.get('/pilote/:piloteId', async (req, res) => {
        try {
            const { piloteId } = req.params;

            const [robots] = await db.query(`
                SELECT r.*, p.nom_fr as pilote_nom_fr
                FROM robots r
                JOIN personnages p ON r.pilote_id = p.id
                WHERE r.pilote_id = ?
                ORDER BY r.nom_fr ASC
            `, [piloteId]);

            return res.json(robots);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Statistiques des robots
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_robots,
                    COUNT(DISTINCT pilote_id) as robots_avec_pilote,
                    COUNT(CASE WHEN pilote_id IS NULL THEN 1 END) as robots_sans_pilote,
                    (SELECT COUNT(*) FROM armes WHERE robot_id IS NOT NULL) as total_armes_associees
                FROM robots
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un nom de robot existe déjà
    router.get('/verifier-nom/:nom', async (req, res) => {
        try {
            const nom = req.params.nom;

            // Vérifier dans nom_fr
            const [resultFr] = await db.query(
                'SELECT id, nom_fr FROM robots WHERE nom_fr = ?',
                [nom]
            );

            // Vérifier dans nom_jp
            const [resultJp] = await db.query(
                'SELECT id, nom_jp FROM robots WHERE nom_jp = ?',
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

    return router;
}