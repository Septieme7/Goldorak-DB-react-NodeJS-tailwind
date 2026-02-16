// hooks/useReferenceData.js
import { useState, useEffect } from 'react';
import { api } from '../api';

export const useReferenceData = () => {
    const [references, setReferences] = useState({
        personnages: [],
        robots: [],
        episodes: [],
        vaisseaux: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchAllReferences = async () => {
            try {
                // Utiliser les méthodes api au lieu de fetch direct
                const [personnages, robots, episodes, vaisseaux] = await Promise.all([
                    api.getPersonnages().catch(() => []),
                    api.getRobots().catch(() => []),
                    api.getEpisodes().catch(() => []),
                    api.getVaisseaux().catch(() => [])
                ]);

                setReferences({
                    personnages: Array.isArray(personnages) ? personnages : [],
                    robots: Array.isArray(robots) ? robots : [],
                    episodes: Array.isArray(episodes) ? episodes : [],
                    vaisseaux: Array.isArray(vaisseaux) ? vaisseaux : [],
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error('Erreur lors du chargement des références:', err);
                setReferences({
                    personnages: [],
                    robots: [],
                    episodes: [],
                    vaisseaux: [],
                    loading: false,
                    error: err.message
                });
            }
        };

        fetchAllReferences();
    }, []);

    return references;
};
