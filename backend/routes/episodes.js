import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerDate,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();

export default function(dbConnection) {
    const db = dbConnection;

    // Routes CRUD pour Épisodes

    // GET - Récupérer tous les épisodes
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT * FROM episodes 
                ORDER BY numero_jp ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer un épisode par ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const [episode] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

            if (episode.length === 0) {
                return res.status(404).json({ error: "Épisode non trouvé" });
            }

            return res.json(episode[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer un nouvel épisode
    router.post('/', async (req, res) => {
        try {
            const {
                numero_jp,
                numero_fr,
                titre_fr,
                titre_jp,
                diffuse_jp,
                diffuse_fr,
                resume
            } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['numero_jp', 'titre_fr']);

            // Valider les dates
            const dateDiffuseJp = validerDate(diffuse_jp);
            const dateDiffuseFr = validerDate(diffuse_fr);

            // Vérifier les doublons de numéros
            const doublons = await verifierDoublonsGenerique(
                db,
                'episodes',
                ['numero_jp', 'numero_fr'],
                [numero_jp, numero_fr]
            );

            if (doublons.length > 0) {
                return res.status(409).json({
                    error: "Doublon détecté",
                    details: doublons
                });
            }

            // Insertion
            const [result] = await db.query(
                `INSERT INTO episodes 
                 (numero_jp, numero_fr, titre_fr, titre_jp, diffuse_jp, diffuse_fr, resume) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    numero_jp,
                    numero_fr || null,
                    titre_fr,
                    titre_jp || null,
                    dateDiffuseJp,
                    dateDiffuseFr,
                    resume || null
                ]
            );

            // Récupérer l'épisode créé
            const [newEpisode] = await db.query('SELECT * FROM episodes WHERE id = ?', [result.insertId]);

            return res.status(201).json({
                message: "Épisode créé avec succès",
                data: newEpisode[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement un épisode
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, [
                'numero_jp', 'numero_fr', 'titre_fr', 'titre_jp', 'diffuse_jp', 'diffuse_fr', 'resume'
            ]);

            // Vérifier si l'épisode existe
            const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Épisode non trouvé" });
            }

            // Valider les dates si fournies
            if (updates.diffuse_jp) {
                updates.diffuse_jp = validerDate(updates.diffuse_jp);
            }
            if (updates.diffuse_fr) {
                updates.diffuse_fr = validerDate(updates.diffuse_fr);
            }

            // Vérifier les doublons de numéros si modifiés
            if (updates.numero_jp || updates.numero_fr) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'episodes',
                    updates.numero_jp ? ['numero_jp'] : updates.numero_fr ? ['numero_fr'] : [],
                    updates.numero_jp ? [updates.numero_jp] : updates.numero_fr ? [updates.numero_fr] : [],
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
                `UPDATE episodes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer l'épisode mis à jour
            const [updatedEpisode] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

            return res.json({
                message: "Épisode mis à jour avec succès",
                data: updatedEpisode[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement un épisode
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const {
                numero_jp,
                numero_fr,
                titre_fr,
                titre_jp,
                diffuse_jp,
                diffuse_fr,
                resume
            } = req.body;

            // Vérifier si l'épisode existe
            const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Épisode non trouvé" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['numero_jp', 'titre_fr']);

            // Valider les dates
            const dateDiffuseJp = validerDate(diffuse_jp);
            const dateDiffuseFr = validerDate(diffuse_fr);

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'episodes',
                ['numero_jp', 'numero_fr'],
                [numero_jp, numero_fr],
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
                `UPDATE episodes 
                 SET numero_jp = ?, numero_fr = ?, titre_fr = ?, titre_jp = ?, 
                     diffuse_jp = ?, diffuse_fr = ?, resume = ?
                 WHERE id = ?`,
                [
                    numero_jp,
                    numero_fr || null,
                    titre_fr,
                    titre_jp || null,
                    dateDiffuseJp,
                    dateDiffuseFr,
                    resume || null,
                    id
                ]
            );

            // Récupérer l'épisode mis à jour
            const [updatedEpisode] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

            return res.json({
                message: "Épisode remplacé avec succès",
                data: updatedEpisode[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer un épisode
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si l'épisode existe
            const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Épisode non trouvé" });
            }

            await db.query('DELETE FROM episodes WHERE id = ?', [id]);

            return res.json({
                message: "Épisode supprimé avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Rechercher des épisodes
    router.get('/recherche/:terme', async (req, res) => {
        try {
            const { terme } = req.params;
            const searchTerm = `%${terme}%`;

            const [result] = await db.query(
                `SELECT * FROM episodes 
                 WHERE titre_fr LIKE ? 
                    OR titre_jp LIKE ? 
                    OR resume LIKE ?
                 ORDER BY numero_jp ASC`,
                [searchTerm, searchTerm, searchTerm]
            );

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Épisodes par saison
    router.get('/saison/:saison', async (req, res) => {
        try {
            const { saison } = req.params;
            let min, max;

            switch (parseInt(saison)) {
                case 1:
                    min = 1;
                    max = 26;
                    break;
                case 2:
                    min = 27;
                    max = 52;
                    break;
                case 3:
                    min = 53;
                    max = 74;
                    break;
                default:
                    return res.status(400).json({ error: "Saison invalide. Choisissez entre 1 et 3." });
            }

            const [result] = await db.query(
                'SELECT * FROM episodes WHERE numero_jp BETWEEN ? AND ? ORDER BY numero_jp ASC',
                [min, max]
            );

            return res.json({
                saison: saison,
                nombre_episodes: result.length,
                episodes: result
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Statistiques des épisodes
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_episodes,
                    COUNT(numero_fr) as episodes_fr,
                    COUNT(*) - COUNT(numero_fr) as episodes_non_doubles,
                    MIN(diffuse_jp) as premiere_diffusion_jp,
                    MAX(diffuse_jp) as derniere_diffusion_jp
                FROM episodes
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un numéro d'épisode existe déjà
    router.get('/verifier-numero/:type/:numero', async (req, res) => {
        try {
            const { type, numero } = req.params;
            const numeroInt = parseInt(numero);

            if (type !== 'jp' && type !== 'fr') {
                return res.status(400).json({ error: "Type invalide. Utilisez 'jp' ou 'fr'" });
            }

            const champ = type === 'jp' ? 'numero_jp' : 'numero_fr';
            const [result] = await db.query(
                `SELECT id, ${champ} FROM episodes WHERE ${champ} = ?`,
                [numeroInt]
            );

            return res.json({
                existe: result.length > 0,
                details: result.length > 0 ? result[0] : null
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    return router;
}