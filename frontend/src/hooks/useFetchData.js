// hooks/useFetchData.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

// Configuration des endpoints - CORRIGÉE pour correspondre à l'API
const ENDPOINT_CONFIG = {
    personnages: {
        fetch: api.getPersonnages,
        create: api.createPersonnage,
        update: api.updatePersonnage,
        delete: api.deletePersonnage,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            faction: '',
            role: '',
            age: 0,
            description: ''
        }
    },
    robots: {
        fetch: api.getRobots,
        create: api.createRobot,
        update: api.updateRobot,
        delete: api.deleteRobot,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            pilote_id: null,
            type_robot: '',
            hauteur: 0,
            poids: 0,
            description: ''
        }
    },
    vaisseaux: {
        fetch: api.getVaisseaux,
        create: api.createVaisseau,
        update: api.updateVaisseau,
        delete: api.deleteVaisseau,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            type_vaisseau: '',
            pilote_id: null,
            faction: '',
            description: ''
        }
    },
    episodes: {
        fetch: api.getEpisodes,
        create: api.createEpisode,
        update: api.updateEpisode,
        delete: api.deleteEpisode,
        defaultData: {
            titre_fr: '',
            titre_jp: '',
            numero_fr: 0,
            numero_jp: 0,
            diffuse_jp: '',
            diffuse_fr: '',
            resume: ''
        }
    },
    armes: {
        fetch: api.getArmes,
        create: api.createArme,
        update: api.updateArme,
        delete: api.deleteArme,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            robot_id: null,
            puissance: '',
            frequence_utilisation: '',
            description: ''
        }
    },
    monstres: {
        fetch: api.getMonstres,
        create: api.createMonstre,
        update: api.updateMonstre,
        delete: api.deleteMonstre,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            episode_id: null,
            description: '',
            type_monstre: '',
            taille: 0,
            puissance: ''
        }
    }
};

// Hook principal pour récupérer des données avec CRUD
export function useFetchData(endpoint) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const config = ENDPOINT_CONFIG[endpoint];

    const fetchData = useCallback(async () => {
        if (!config) {
            setError(`Endpoint inconnu: ${endpoint}`);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log(`Fetching ${endpoint}...`);
            const result = await config.fetch();
            console.log(`${endpoint} fetched:`, result);
            setData(result);
        } catch (err) {
            setError(err.message);
            console.error(`Erreur lors du chargement des ${endpoint}:`, err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, config]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleView = useCallback((item) => {
        console.log('View item:', item);
        setSelectedItem(item);
        setModalType('view');
        setShowModal(true);
    }, []);

    const handleEdit = useCallback((item) => {
        console.log('Edit item:', item);
        setSelectedItem(item);
        setModalType('edit');
        setShowModal(true);
    }, []);

    const handleDelete = useCallback(async (id, name) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return;

        try {
            if (!config) throw new Error(`Endpoint inconnu: ${endpoint}`);
            console.log(`Deleting ${endpoint} with id:`, id);
            await config.delete(id);
            await fetchData();
            console.log(`Successfully deleted ${endpoint} ${id}`);
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            alert('Erreur lors de la suppression');
        }
    }, [endpoint, config, fetchData]);

    const handleCreate = useCallback(() => {
        console.log('Creating new item for', endpoint);
        const defaultItem = config?.defaultData || {};
        console.log('Default data:', defaultItem);
        setSelectedItem(defaultItem);
        setModalType('create');
        setShowModal(true);
    }, [config, endpoint]);

    const handleSave = useCallback(async (itemData) => {
        console.log('Saving item for', endpoint, 'with data:', itemData);
        console.log('Modal type:', modalType);

        try {
            if (!config) throw new Error(`Endpoint inconnu: ${endpoint}`);

            // Convertir les valeurs vides en null pour les champs numériques optionnels
            const cleanedData = { ...itemData };

            // Nettoyer les données avant envoi
            Object.keys(cleanedData).forEach(key => {
                if (cleanedData[key] === '' || cleanedData[key] === undefined) {
                    cleanedData[key] = null;
                }
                // Convertir les nombres
                if (typeof cleanedData[key] === 'string' && !isNaN(cleanedData[key]) && cleanedData[key] !== '') {
                    if (key.includes('age') || key.includes('numero') || key.includes('annee') || key.includes('taille') || key.includes('poids')) {
                        cleanedData[key] = parseFloat(cleanedData[key]);
                    }
                }
            });

            console.log('Cleaned data to save:', cleanedData);

            let result;
            if (modalType === 'create') {
                console.log('Creating with config.create');
                result = await config.create(cleanedData);
                console.log('Create result:', result);
            } else {
                console.log('Updating with config.update, id:', cleanedData.id);
                result = await config.update(cleanedData.id, cleanedData);
                console.log('Update result:', result);
            }

            setShowModal(false);
            await fetchData();
            console.log('Data refreshed after save');
        } catch (err) {
            console.error('Erreur détaillée lors de la sauvegarde:', err);
            console.error('Error stack:', err.stack);
            alert(`Erreur lors de la sauvegarde: ${err.message}\nVérifiez la console pour plus de détails.`);
        }
    }, [endpoint, config, modalType, fetchData]);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setSelectedItem(null);
        setModalType(null);
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        handleView,
        handleEdit,
        handleDelete,
        handleCreate,
        handleSave,
        selectedItem,
        modalType,
        showModal,
        setShowModal,
        closeModal
    };
}

// Hook pour récupérer les statistiques
export function useFetchStats() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const endpoints = Object.keys(ENDPOINT_CONFIG);
            const results = await Promise.all(
                endpoints.map(async (endpoint) => {
                    try {
                        const response = await ENDPOINT_CONFIG[endpoint].fetch();
                        return Array.isArray(response) ? response.length : 0;
                    } catch {
                        return 0;
                    }
                })
            );

            const newStats = {};
            endpoints.forEach((endpoint, index) => {
                newStats[endpoint] = results[index];
            });

            setStats(newStats);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors du chargement des stats:', err);
            // Valeurs par défaut
            const defaultStats = {};
            Object.keys(ENDPOINT_CONFIG).forEach(key => {
                defaultStats[key] = 0;
            });
            setStats(defaultStats);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

// Hook pour vérifier le statut de l'API
export function useApiStatus() {
    const [status, setStatus] = useState('unknown');
    const [loading, setLoading] = useState(true);

    const checkApiStatus = useCallback(async () => {
        setLoading(true);
        try {
            await api.getPersonnages();
            setStatus('online');
        } catch {
            setStatus('offline');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkApiStatus();
        const interval = setInterval(checkApiStatus, 30000);
        return () => clearInterval(interval);
    }, [checkApiStatus]);

    return { status, loading, checkApiStatus };
}