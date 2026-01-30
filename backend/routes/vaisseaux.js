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

    // Types de vaisseaux autorisés
    const typesVaisseaux = [
        'Vaisseau-mère',
        'Croiseur de combat',
        'Vaisseau de combat',
        'Char d\'assaut',
        'Submersible',
        'Vaisseau de reconnaissance',
        'Vaisseau de recherche',
        'Vaisseau expérimental'
    ];

    // Routes CRUD pour Vaisseaux

    // GET - Récupérer tous les vaisseaux avec leurs pilotes
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT v.*, 
                       p.nom_fr as pilote_nom_fr,
                       p.nom_jp as pilote_nom_jp
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                ORDER BY v.nom_fr ASC
            `);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Récupérer un vaisseau par ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const [vaisseau] = await db.query(`
                SELECT v.*, p.nom_fr as pilote_nom_fr, p.nom_jp as pilote_nom_jp
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                WHERE v.id = ?
            `, [id]);

            if (vaisseau.length === 0) {
                return res.status(404).json({ error: "Vaisseau non trouvé" });
            }

            return res.json(vaisseau[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // POST - Créer un nouveau vaisseau
    router.post('/', async (req, res) => {
        try {
            const { nom_fr, nom_jp, type_vaisseau, pilote_id, description } = req.body;

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Valider le type de vaisseau
            const typeValide = validerEnum(type_vaisseau, typesVaisseaux, 'type_vaisseau');

            // Vérifier si le pilote existe (si pilote_id est fourni)
            if (pilote_id) {
                await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'vaisseaux',
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
                `INSERT INTO vaisseaux (nom_fr, nom_jp, type_vaisseau, pilote_id, description) 
                 VALUES (?, ?, ?, ?, ?)`,
                [nom_fr, nom_jp || null, typeValide, pilote_id || null, description || null]
            );

            // Récupérer le vaisseau créé
            const [newVaisseau] = await db.query(`
                SELECT v.*, p.nom_fr as pilote_nom_fr
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                WHERE v.id = ?
            `, [result.insertId]);

            return res.status(201).json({
                message: "Vaisseau créé avec succès",
                data: newVaisseau[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PATCH - Mettre à jour partiellement un vaisseau
    router.patch('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'type_vaisseau', 'pilote_id', 'description']);

            // Vérifier si le vaisseau existe
            const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Vaisseau non trouvé" });
            }

            // Valider le type de vaisseau si modifié
            if (updates.type_vaisseau) {
                updates.type_vaisseau = validerEnum(updates.type_vaisseau, typesVaisseaux, 'type_vaisseau');
            }

            // Vérifier si le pilote existe (si pilote_id est modifié)
            if (updates.pilote_id) {
                await validerIdExistant(db, 'personnages', updates.pilote_id, 'Personnage');
            }

            // Vérifier les doublons si nom_fr ou nom_jp sont modifiés
            if (updates.nom_fr || updates.nom_jp) {
                const doublons = await verifierDoublonsGenerique(
                    db,
                    'vaisseaux',
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
                `UPDATE vaisseaux SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
                values
            );

            // Récupérer le vaisseau mis à jour
            const [updatedVaisseau] = await db.query(`
                SELECT v.*, p.nom_fr as pilote_nom_fr
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                WHERE v.id = ?
            `, [id]);

            return res.json({
                message: "Vaisseau mis à jour avec succès",
                data: updatedVaisseau[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // PUT - Remplacer complètement un vaisseau
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { nom_fr, nom_jp, type_vaisseau, pilote_id, description } = req.body;

            // Vérifier si le vaisseau existe
            const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Vaisseau non trouvé" });
            }

            // Validation des champs requis
            validerChampsRequis(req.body, ['nom_fr']);

            // Valider le type de vaisseau
            const typeValide = validerEnum(type_vaisseau, typesVaisseaux, 'type_vaisseau');

            // Vérifier si le pilote existe (si pilote_id est fourni)
            if (pilote_id) {
                await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
            }

            // Vérifier les doublons
            const doublons = await verifierDoublonsGenerique(
                db,
                'vaisseaux',
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
                `UPDATE vaisseaux 
                 SET nom_fr = ?, nom_jp = ?, type_vaisseau = ?, pilote_id = ?, description = ?
                 WHERE id = ?`,
                [nom_fr, nom_jp || null, typeValide, pilote_id || null, description || null, id]
            );

            // Récupérer le vaisseau mis à jour
            const [updatedVaisseau] = await db.query(`
                SELECT v.*, p.nom_fr as pilote_nom_fr
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                WHERE v.id = ?
            `, [id]);

            return res.json({
                message: "Vaisseau remplacé avec succès",
                data: updatedVaisseau[0]
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // DELETE - Supprimer un vaisseau
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si le vaisseau existe
            const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
            if (existing.length === 0) {
                return res.status(404).json({ error: "Vaisseau non trouvé" });
            }

            await db.query('DELETE FROM vaisseaux WHERE id = ?', [id]);

            return res.json({
                message: "Vaisseau supprimé avec succès"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vaisseaux par type
    router.get('/type/:type', async (req, res) => {
        try {
            const { type } = req.params;

            // Valider le type
            const typeValide = validerEnum(type, typesVaisseaux, 'type_vaisseau');

            const [vaisseaux] = await db.query(`
                SELECT v.*, p.nom_fr as pilote_nom_fr
                FROM vaisseaux v
                LEFT JOIN personnages p ON v.pilote_id = p.id
                WHERE v.type_vaisseau = ?
                ORDER BY v.nom_fr ASC
            `, [typeValide]);

            return res.json({
                type: typeValide,
                nombre: vaisseaux.length,
                vaisseaux: vaisseaux
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });

    // GET - Vaisseaux par pilote
    router.get('/pilote/:piloteId', async (req, res) => {
        try {
            const { piloteId } = req.params;

            const [vaisseaux] = await db.query(
                'SELECT * FROM vaisseaux WHERE pilote_id = ? ORDER BY nom_fr ASC',
                [piloteId]
            );

            return res.json(vaisseaux);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vaisseaux sans pilote
    router.get('/sans-pilote', async (req, res) => {
        try {
            const [vaisseaux] = await db.query(
                'SELECT * FROM vaisseaux WHERE pilote_id IS NULL ORDER BY nom_fr ASC'
            );

            return res.json(vaisseaux);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Statistiques des vaisseaux
    router.get('/statistiques/total', async (req, res) => {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) as total_vaisseaux,
                    COUNT(DISTINCT type_vaisseau) as types_differents,
                    COUNT(pilote_id) as vaisseaux_avec_pilote,
                    COUNT(CASE WHEN pilote_id IS NULL THEN 1 END) as vaisseaux_sans_pilote,
                    GROUP_CONCAT(DISTINCT type_vaisseau) as liste_types
                FROM vaisseaux
            `);

            return res.json(stats[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    // GET - Vérifier si un nom de vaisseau existe déjà
    router.get('/verifier-nom/:nom', async (req, res) => {
        try {
            const nom = req.params.nom;

            // Vérifier dans nom_fr
            const [resultFr] = await db.query(
                'SELECT id, nom_fr FROM vaisseaux WHERE nom_fr = ?',
                [nom]
            );

            // Vérifier dans nom_jp
            const [resultJp] = await db.query(
                'SELECT id, nom_jp FROM vaisseaux WHERE nom_jp = ?',
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

    // GET - Liste des types de vaisseaux disponibles
    router.get('/types/disponibles', (req, res) => {
        return res.json(typesVaisseaux);
    });

    return router;
}