// api.js - VERSION CORRIGÉE
const API_BASE_URL = 'http://localhost:8800/api/v1';

// Fonction helper améliorée
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    // Si l'API retourne un format standardisé {success, data, message}
    if (result.success !== undefined) {
        if (!result.success) {
            throw new Error(result.error || 'API request failed');
        }
        return result.data; // Retourne seulement les données
    }

    // Si format legacy (tableau direct)
    return result;
};

export const api = {
    // Personnages
    getPersonnages: () => fetch(`${API_BASE_URL}/personnages`).then(handleResponse),
    getPersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`).then(handleResponse),
    createPersonnage: (data) => fetch(`${API_BASE_URL}/personnages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updatePersonnage: (id, data) => fetch(`${API_BASE_URL}/personnages/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deletePersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Robots
    getRobots: () => fetch(`${API_BASE_URL}/robots`).then(handleResponse),
    getRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`).then(handleResponse),
    createRobot: (data) => fetch(`${API_BASE_URL}/robots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateRobot: (id, data) => fetch(`${API_BASE_URL}/robots/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Vaisseaux
    getVaisseaux: () => fetch(`${API_BASE_URL}/vaisseaux`).then(handleResponse),
    getVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`).then(handleResponse),
    createVaisseau: (data) => fetch(`${API_BASE_URL}/vaisseaux`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateVaisseau: (id, data) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Épisodes
    getEpisodes: () => fetch(`${API_BASE_URL}/episodes`).then(handleResponse),
    getEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`).then(handleResponse),
    createEpisode: (data) => fetch(`${API_BASE_URL}/episodes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateEpisode: (id, data) => fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Armes
    getArmes: () => fetch(`${API_BASE_URL}/armes`).then(handleResponse),
    getArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`).then(handleResponse),
    createArme: (data) => fetch(`${API_BASE_URL}/armes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateArme: (id, data) => fetch(`${API_BASE_URL}/armes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Monstres
    getMonstres: () => fetch(`${API_BASE_URL}/monstres`).then(handleResponse),
    getMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`).then(handleResponse),
    createMonstre: (data) => fetch(`${API_BASE_URL}/monstres`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateMonstre: (id, data) => fetch(`${API_BASE_URL}/monstres/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Stats
    getStats: () => fetch(`${API_BASE_URL}/stats`).then(handleResponse),
    getHealth: () => fetch(`${API_BASE_URL}/health`).then(handleResponse)
};