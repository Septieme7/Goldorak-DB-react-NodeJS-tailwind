// AppWithAuth.jsx - Version avec authentification OAuth2
import { useState } from 'react';
import GrendizerLogo from './assets/GrendizerLogo.png';
import './App.css';

// Import des hooks depuis le fichier corrigé
import { useFetchStats, useApiStatus } from './hooks/useFetchData';

// Import du contexte d'authentification
import { useAuth } from './context/AuthContext';

// Import des composants
import Personnages from './components/Personnages';
import Robots from './components/Robots';
import Armes from './components/Armes';
import Episodes from './components/Episodes';
import Monstres from './components/Monstres';
import Vaisseaux from './components/Vaisseaux';
import Header from './components/Header';

function AppWithAuth() {
    const [activeTab, setActiveTab] = useState('personnages');
    const { user } = useAuth();

    // Utilisation des hooks - avec gestion des valeurs par défaut
    const {
        stats = {
            personnages: 0,
            robots: 0,
            armes: 0,
            episodes: 0,
            monstres: 0,
            vaisseaux: 0
        },
        loading: statsLoading,
        refetch: refetchStats
    } = useFetchStats();

    const {
        status = 'unknown',
        checkApiStatus
    } = useApiStatus();

    const handleRefreshAll = () => {
        refetchStats();
        checkApiStatus();
    };

    const renderActiveComponent = () => {
        switch(activeTab) {
            case 'personnages':
                return <Personnages />;
            case 'robots':
                return <Robots />;
            case 'armes':
                return <Armes />;
            case 'episodes':
                return <Episodes />;
            case 'monstres':
                return <Monstres />;
            case 'vaisseaux':
                return <Vaisseaux />;
            default:
                return <Personnages />;
        }
    };

    const getTabIcon = (tab) => {
        switch(tab) {
            case 'personnages': return '👥';
            case 'robots': return '🤖';
            case 'episodes': return '📺';
            case 'armes': return '⚔️';
            case 'monstres': return '🐉';
            case 'vaisseaux': return '🚀';
            default: return '📊';
        }
    };

    return (
        <div className="app">
            {/* Header avec infos utilisateur */}
            <Header />

            <header className="header">
                <div className="logo-container">
                    <img
                        src={GrendizerLogo}
                        alt="Goldorak Database"
                        className="logo-image"
                    />
                </div>
                <p>Base de données complète de l'univers Goldorak</p>
            </header>

            <div className="dashboard">
                <div className="status-panel">
                    <div className="status-info">
                        <div className="status-item">
                            <span>API Status:</span>
                            <span className={`status ${status}`}>
                                {status === 'online' ? '✅ En ligne' :
                                    status === 'offline' ? '❌ Hors ligne' : '⏳ Vérification...'}
                            </span>
                        </div>
                        <div className="status-item">
                            <span>Dernier refresh:</span>
                            <span>{new Date().toLocaleTimeString('fr-FR')}</span>
                        </div>
                        <button className="btn-refresh" onClick={handleRefreshAll}>
                            🔄 Actualiser
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <div className="stat-info">
                            <span className="stat-label">Personnages</span>
                            <span className="stat-value">{stats.personnages}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🤖</span>
                        <div className="stat-info">
                            <span className="stat-label">Robots</span>
                            <span className="stat-value">{stats.robots}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⚔️</span>
                        <div className="stat-info">
                            <span className="stat-label">Armes</span>
                            <span className="stat-value">{stats.armes}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📺</span>
                        <div className="stat-info">
                            <span className="stat-label">Épisodes</span>
                            <span className="stat-value">{stats.episodes}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🐉</span>
                        <div className="stat-info">
                            <span className="stat-label">Monstres</span>
                            <span className="stat-value">{stats.monstres}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🚀</span>
                        <div className="stat-info">
                            <span className="stat-label">Vaisseaux</span>
                            <span className="stat-value">{stats.vaisseaux}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs">
                {['personnages', 'robots', 'vaisseaux', 'armes', 'episodes', 'monstres'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <span className="tab-icon">{getTabIcon(tab)}</span>
                        <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    </button>
                ))}
            </div>

            <div className="content">
                {renderActiveComponent()}
            </div>
        </div>
    );
}

export default AppWithAuth;
