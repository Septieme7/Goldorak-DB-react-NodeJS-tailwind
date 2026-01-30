import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    validerEnum,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();

export default function(dbConnection) {
    const db = dbConnection;

    // Valeurs autorisées pour frequence_utilisation
    const valeursFrequence = [
        'Très Fréquente',
        'Fréquente',
        'Occasionnelle',
        'Assez Rare',
        'Rare',
        'Très Rare'
    ];

    // Routes CRUD pour Armes

    // GET - Récupérer toutes les armes avec leurs robots
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT a.*, 
                       r.nom_fr as robot_nom_fr,
                       r.nom_jp as robot_nom_jp
                FROM armes a
                LEFT JOIN robots r ON a.robot_id = r.id
                ORDER BY a.nom_fr ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer une arme par ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const [arme] = await db.query(`
                SELECT a.*, r.nom_fr as robot_nom_fr, r.nom_jp as robot_nom_jp
                FROM armes a
                LEFT JOIN robots r ON a.robot_id = r.id
                WHERE a.id = ?
            `, [id]);

            if (arme.length === 0) {
                return res.status(404).json({ error: "Arme non trouvée" });
            }

            return res.json(arme[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer une nouvelle arme
    router.post('/', async (req, res) => {
        try {
            const { nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr', 'nom_jp', 'robot_id']);

            // Vérifier si le robot existe
            await validerIdExistant(db, 'robots', robot_id, 'Robot');

            // Valider la fréquence d'utilisation
            const frequenceValide = validerEnum(frequence_utilisation, valeursFrequence, 'frequence_utilisation');

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'armes',
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
                `INSERT INTO armes (nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nom_fr, nom_jp, robot_id, puissance || null, frequenceValide, description || null]
            );

            // Récupérer l'arme créée
            const [newArme] = await db.query(`
                SELECT a.*, r.nom_fr as robot_nom_fr
                FROM armes a
                LEFT JOIN robots r ON a.robot_id = r.id
                WHERE a.id = ?
            `, [result.insertId]);

            return res.status(201).json({
                message: "Arme créée avec succès",
                data: newArme[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement une arme
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, [
                'nom_fr', 'nom_jp', 'robot_id', 'puissance', 'frequence_utilisation', 'description'
            ]);

            // Vérifier si l'arme existe
            const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Arme non trouvée" });
            }

            // Vérifier si le robot existe (si robot_id est modifié)
            if (updates.robot_id) {
                await validerIdExistant(db, 'robots', updates.robot_id, 'Robot');
            }

            // Valider la fréquence d'utilisation si modifiée
            if (updates.frequence_utilisation) {
                updates.frequence_utilisation = validerEnum(
                    updates.frequence_utilisation,
                    valeursFrequence,
                    'frequence_utilisation'
                );
            }

            // Vérifier les doublons si nom_fr ou nom_jp sont modifiés
            if (updates.nom_fr || updates.nom_jp) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'armes',
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
                `UPDATE armes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer l'arme mise à jour
            const [updatedArme] = await db.query(`
                SELECT a.*, r.nom_fr as robot_nom_fr
                FROM armes a
                LEFT JOIN robots r ON a.robot_id = r.id
                WHERE a.id = ?
            `, [id]);

            return res.json({
                message: "Arme mise à jour avec succès",
                data: updatedArme[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement une arme
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description } = req.body;

            // Vérifier si l'arme existe
            const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Arme non trouvée" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr', 'nom_jp', 'robot_id']);

            // Vérifier si le robot existe
            await validerIdExistant(db, 'robots', robot_id, 'Robot');

            // Valider la fréquence d'utilisation
            const frequenceValide = validerEnum(frequence_utilisation, valeursFrequence, 'frequence_utilisation');

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'armes',
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
                `UPDATE armes 
                 SET nom_fr = ?, nom_jp = ?, robot_id = ?, puissance = ?, frequence_utilisation = ?, description = ?
                 WHERE id = ?`,
                [nom_fr, nom_jp, robot_id, puissance || null, frequenceValide, description || null, id]
            );

            // Récupérer l'arme mise à jour
            const [updatedArme] = await db.query(`
                SELECT a.*, r.nom_fr as robot_nom_fr
                FROM armes a
                LEFT JOIN robots r ON a.robot_id = r.id
                WHERE a.id = ?
            `, [id]);

            return res.json({
                message: "Arme remplacée avec succès",
                data: updatedArme[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer une arme
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si l'arme existe
            const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Arme non trouvée" });
            }

            await db.query('DELETE FROM armes WHERE id = ?', [id]);

            return res.json({
                message: "Arme supprimée avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Armes par robot
    router.get('/robot/:robotId', async (req, res) => {
        try {
            const { robotId } = req.params;

            const [armes] = await db.query(
                'SELECT * FROM armes WHERE robot_id = ? ORDER BY nom_fr ASC',
                [robotId]
            );

            return res.json(armes);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Armes par fréquence d'utilisation
    router.get('/frequence/:frequence', async (req, res) => {
        try {
            const { frequence } = req.params;

            // Valider la fréquence
            const frequenceValide = validerEnum(frequence, valeursFrequence, 'frequence_utilisation');

            const [armes] = await db.query(
                'SELECT * FROM armes WHERE frequence_utilisation = ? ORDER BY nom_fr ASC',
                [frequenceValide]
            );

            return res.json({
                frequence: frequenceValide,
                nombre: armes.length,
                armes: armes
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // GET - Statistiques des armes
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_armes,
                    COUNT(robot_id) as armes_avec_robot,
                    COUNT(CASE WHEN robot_id IS NULL THEN 1 END) as armes_sans_robot,
                    COUNT(DISTINCT frequence_utilisation) as frequences_differentes,
                    (SELECT COUNT(*) FROM armes WHERE robot_id = 1) as armes_goldorak
                FROM armes
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un nom d'arme existe déjà
    router.get('/verifier-nom/:nom', async (req, res) => {
        try {
            const nom = req.params.nom;

            // Vérifier dans nom_fr
            const [resultFr] = await db.query(
                'SELECT id, nom_fr FROM armes WHERE nom_fr = ?',
                [nom]
            );

            // Vérifier dans nom_jp
            const [resultJp] = await db.query(
                'SELECT id, nom_jp FROM armes WHERE nom_jp = ?',
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

    // GET - Liste des fréquences d'utilisation disponibles
    router.get('/frequences/disponibles', (req, res) => {
        return res.json(valeursFrequence);
    });

    return router;
}