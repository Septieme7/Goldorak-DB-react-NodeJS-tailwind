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

    // Routes CRUD pour Monstres

    // GET - Récupérer tous les monstres avec leurs épisodes
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT m.*, 
                       e.numero_jp as episode_numero_jp,
                       e.numero_fr as episode_numero_fr,
                       e.titre_fr as episode_titre_fr
                FROM monstres m
                LEFT JOIN episodes e ON m.episode_id = e.id
                ORDER BY m.nom_fr ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer un monstre par ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const [monstre] = await db.query(`
                SELECT m.*, 
                       e.numero_jp as episode_numero_jp,
                       e.numero_fr as episode_numero_fr,
                       e.titre_fr as episode_titre_fr
                FROM monstres m
                LEFT JOIN episodes e ON m.episode_id = e.id
                WHERE m.id = ?
            `, [id]);

            if (monstre.length === 0) {
                return res.status(404).json({ error: "Monstre non trouvé" });
            }

            return res.json(monstre[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer un nouveau monstre
    router.post('/', async (req, res) => {
        try {
            const { nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier si l'épisode existe (si episode_id est fourni)
            if (episode_id && episode_id !== '') {
                await validerIdExistant(db, 'episodes', episode_id, 'Épisode');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'monstres',
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
                `INSERT INTO monstres (nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    nom_fr,
                    nom_jp || null,
                    (episode_id && episode_id !== '') ? episode_id : null,
                    description || null,
                    type_monstre || null,
                    taille || null,
                    puissance || null
                ]
            );

            // Récupérer le monstre créé
            const [newMonstre] = await db.query(`
                SELECT m.*, e.titre_fr as episode_titre_fr
                FROM monstres m
                LEFT JOIN episodes e ON m.episode_id = e.id
                WHERE m.id = ?
            `, [result.insertId]);

            return res.status(201).json({
                message: "Monstre créé avec succès",
                data: newMonstre[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement un monstre
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'episode_id', 'description', 'type_monstre', 'taille', 'puissance']);

            // Vérifier si le monstre existe
            const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Monstre non trouvé" });
            }

            // Vérifier si l'épisode existe (si episode_id est modifié)
            if (updates.episode_id && updates.episode_id !== '') {
                await validerIdExistant(db, 'episodes', updates.episode_id, 'Épisode');
            } else if (updates.episode_id === '') {
                updates.episode_id = null;
            }

            // Vérifier les doublons si nom_fr ou nom_jp sont modifiés
            if (updates.nom_fr || updates.nom_jp) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'monstres',
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
                `UPDATE monstres SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer le monstre mis à jour
            const [updatedMonstre] = await db.query(`
                SELECT m.*, e.titre_fr as episode_titre_fr
                FROM monstres m
                LEFT JOIN episodes e ON m.episode_id = e.id
                WHERE m.id = ?
            `, [id]);

            return res.json({
                message: "Monstre mis à jour avec succès",
                data: updatedMonstre[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement un monstre
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance } = req.body;

            // Vérifier si le monstre existe
            const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Monstre non trouvé" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Vérifier si l'épisode existe (si episode_id est fourni)
            if (episode_id && episode_id !== '') {
                await validerIdExistant(db, 'episodes', episode_id, 'Épisode');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'monstres',
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
                `UPDATE monstres
                 SET nom_fr = ?, nom_jp = ?, episode_id = ?, description = ?, type_monstre = ?, taille = ?, puissance = ?
                 WHERE id = ?`,
                [
                    nom_fr,
                    nom_jp || null,
                    (episode_id && episode_id !== '') ? episode_id : null,
                    description || null,
                    type_monstre || null,
                    taille || null,
                    puissance || null,
                    id
                ]
            );

            // Récupérer le monstre mis à jour
            const [updatedMonstre] = await db.query(`
                SELECT m.*, e.titre_fr as episode_titre_fr
                FROM monstres m
                LEFT JOIN episodes e ON m.episode_id = e.id
                WHERE m.id = ?
            `, [id]);

            return res.json({
                message: "Monstre remplacé avec succès",
                data: updatedMonstre[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer un monstre
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si le monstre existe
            const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Monstre non trouvé" });
            }

            await db.query('DELETE FROM monstres WHERE id = ?', [id]);

            return res.json({
                message: "Monstre supprimé avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Monstres par épisode
    router.get('/episode/:episodeId', async (req, res) => {
        try {
            const { episodeId } = req.params;

            const [monstres] = await db.query(
                'SELECT * FROM monstres WHERE episode_id = ? ORDER BY nom_fr ASC',
                [episodeId]
            );

            return res.json(monstres);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Monstres sans épisode associé
    router.get('/sans-episode', async (req, res) => {
        try {
            const [monstres] = await db.query(
                'SELECT * FROM monstres WHERE episode_id IS NULL ORDER BY nom_fr ASC'
            );

            return res.json(monstres);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Statistiques des monstres
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_monstres,
                    COUNT(episode_id) as monstres_avec_episode,
                    COUNT(CASE WHEN episode_id IS NULL THEN 1 END) as monstres_sans_episode
                FROM monstres
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un nom de monstre existe déjà
    router.get('/verifier-nom/:nom', async (req, res) => {
        try {
            const nom = req.params.nom;

            // Vérifier dans nom_fr
            const [resultFr] = await db.query(
                'SELECT id, nom_fr FROM monstres WHERE nom_fr = ?',
                [nom]
            );

            // Vérifier dans nom_jp
            const [resultJp] = await db.query(
                'SELECT id, nom_jp FROM monstres WHERE nom_jp = ?',
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