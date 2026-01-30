// hooks/useFormFields.js
import { useMemo } from 'react';

export const useFormFields = (endpoint) => {
    const fieldConfigs = useMemo(() => {
        const configs = {
            personnages: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                { name: 'faction', label: 'Faction', type: 'text' },
                { name: 'role', label: 'Rôle', type: 'text' },
                { name: 'age', label: 'Âge', type: 'number', min: 0 },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            robots: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                { name: 'pilote_id', label: 'ID Pilote', type: 'number' },
                { name: 'type_robot', label: 'Type de Robot', type: 'text' },
                { name: 'hauteur', label: 'Hauteur (m)', type: 'number', step: 0.1 },
                { name: 'poids', label: 'Poids (t)', type: 'number', step: 0.1 },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            vaisseaux: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                { name: 'type_vaisseau', label: 'Type de Vaisseau', type: 'text' },
                { name: 'pilote_id', label: 'ID Pilote', type: 'number' },
                { name: 'faction', label: 'Faction', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            episodes: [
                { name: 'titre_fr', label: 'Titre Français', type: 'text', required: true },
                { name: 'titre_jp', label: 'Titre Japonais', type: 'text' },
                { name: 'numero_fr', label: 'Numéro FR', type: 'number', min: 1 },
                { name: 'numero_jp', label: 'Numéro JP', type: 'number', min: 1 },
                { name: 'diffuse_jp', label: 'Diffusion JP', type: 'date' },
                { name: 'diffuse_fr', label: 'Diffusion FR', type: 'date' },
                { name: 'resume', label: 'Résumé', type: 'textarea' }
            ],
            armes: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                { name: 'robot_id', label: 'ID Robot', type: 'number' },
                { name: 'puissance', label: 'Puissance', type: 'text' },
                { name: 'frequence_utilisation', label: 'Fréquence', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            monstres: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                { name: 'episode_id', label: 'ID Épisode', type: 'number' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'type_monstre', label: 'Type de Monstre', type: 'text' },
                { name: 'taille', label: 'Taille (m)', type: 'number', step: 0.1 },
                { name: 'puissance', label: 'Puissance', type: 'text' }
            ]
        };

        return configs[endpoint] || [];
    }, [endpoint]);

    return fieldConfigs;
};

// Fonction utilitaire pour obtenir les données par défaut
export const getDefaultData = (endpoint) => {
    const defaultData = {
        personnages: {
            nom_fr: '',
            nom_jp: '',
            faction: '',
            role: '',
            age: 0,
            description: ''
        },
        robots: {
            nom_fr: '',
            nom_jp: '',
            pilote_id: null,
            type_robot: '',
            hauteur: 0,
            poids: 0,
            description: ''
        },
        vaisseaux: {
            nom_fr: '',
            nom_jp: '',
            type_vaisseau: '',
            pilote_id: null,
            faction: '',
            description: ''
        },
        episodes: {
            titre_fr: '',
            titre_jp: '',
            numero_fr: 0,
            numero_jp: 0,
            diffuse_jp: '',
            diffuse_fr: '',
            resume: ''
        },
        armes: {
            nom_fr: '',
            nom_jp: '',
            robot_id: null,
            puissance: '',
            frequence_utilisation: '',
            description: ''
        },
        monstres: {
            nom_fr: '',
            nom_jp: '',
            episode_id: null,
            description: '',
            type_monstre: '',
            taille: 0,
            puissance: ''
        }
    };

    return defaultData[endpoint] || {};
};