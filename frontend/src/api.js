// api.js - VERSION AVEC AUTHENTIFICATION OAUTH2
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

// Fonction pour obtenir le token d'authentification
const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Fonction pour créer les headers avec authentification
const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Fonction helper améliorée
const handleResponse = async (response) => {
    // Si non authentifié, rediriger vers la page de login
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expirée - Veuillez vous reconnecter');
    }

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
    getPersonnages: () => fetch(`${API_BASE_URL}/personnages`, {
        headers: getHeaders()
    }).then(handleResponse),
    getPersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createPersonnage: (data) => fetch(`${API_BASE_URL}/personnages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updatePersonnage: (id, data) => fetch(`${API_BASE_URL}/personnages/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deletePersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Robots
    getRobots: () => fetch(`${API_BASE_URL}/robots`, {
        headers: getHeaders()
    }).then(handleResponse),
    getRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createRobot: (data) => fetch(`${API_BASE_URL}/robots`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateRobot: (id, data) => fetch(`${API_BASE_URL}/robots/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Vaisseaux
    getVaisseaux: () => fetch(`${API_BASE_URL}/vaisseaux`, {
        headers: getHeaders()
    }).then(handleResponse),
    getVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createVaisseau: (data) => fetch(`${API_BASE_URL}/vaisseaux`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateVaisseau: (id, data) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Épisodes
    getEpisodes: () => fetch(`${API_BASE_URL}/episodes`, {
        headers: getHeaders()
    }).then(handleResponse),
    getEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createEpisode: (data) => fetch(`${API_BASE_URL}/episodes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateEpisode: (id, data) => fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Armes
    getArmes: () => fetch(`${API_BASE_URL}/armes`, {
        headers: getHeaders()
    }).then(handleResponse),
    getArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createArme: (data) => fetch(`${API_BASE_URL}/armes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateArme: (id, data) => fetch(`${API_BASE_URL}/armes/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Monstres
    getMonstres: () => fetch(`${API_BASE_URL}/monstres`, {
        headers: getHeaders()
    }).then(handleResponse),
    getMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`, {
        headers: getHeaders()
    }).then(handleResponse),
    createMonstre: (data) => fetch(`${API_BASE_URL}/monstres`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateMonstre: (id, data) => fetch(`${API_BASE_URL}/monstres/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse),

    // Stats
    getStats: () => fetch(`${API_BASE_URL}/stats`, {
        headers: getHeaders()
    }).then(handleResponse),

    // Health check (sans authentification)
    getHealth: () => fetch(`${API_BASE_URL}/health`, {
        headers: getHeaders(false)
    }).then(handleResponse),

    // Easter Egg — route publique (pas de token requis)
    triggerEasterEgg: () => fetch(`${API_BASE_URL}/easter-egg`, {
        method: 'POST',
        headers: getHeaders(false)
    }).then(handleResponse),
};