// AppWithAuth.jsx - Avec authentification OAuth2 + Lecteur Goldorak + Easter Egg Konami
import { useState, useRef, useEffect } from 'react';
import GrendizerLogo from './assets/GrendizerLogo.png';
import './App.css';

// Import des hooks
import { useFetchStats, useApiStatus } from './hooks/useFetchData';
import { useKonamiCode } from './hooks/useKonamiCode';

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
import MusicPlayer from './components/MusicPlayer';

function AppWithAuth() {
    const [activeTab, setActiveTab] = useState('personnages');
    const { user } = useAuth();

    // États pour l'easter egg
    const [showEasterImage, setShowEasterImage] = useState(false);
    const [isEasterActive, setIsEasterActive] = useState(false);
    const audioRef = useRef(null);

    // Utilisation des hooks stats et API
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

    // Activation de l'easter egg (appelé par le hook)
    const activateEasterEgg = () => {
        setIsEasterActive(true);
        setShowEasterImage(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0; // reprend du début
            audioRef.current.play().catch(err => console.log("Lecture auto bloquée", err));
        }

        fetch('/api/v1/easter-egg', { method: 'POST' }).catch(console.error);

        // Masquer l'image après 6 secondes
        setTimeout(() => setShowEasterImage(false), 10000);

        // Désactiver le curseur et le filtre après 10 secondes (mais la musique continue)
        setTimeout(() => setIsEasterActive(false), 10000);

        // Optionnel : arrêter la musique après 3 minutes (180000 ms)
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }, 180000);
    };

    // Hook Konami Code
    const konamiActive = useKonamiCode(activateEasterEgg);

    // Gestion du curseur et du filtre CSS pendant l'effet
    useEffect(() => {
        if (isEasterActive) {
            document.body.classList.add('easter-egg-cursor');
            document.body.classList.add('tailwind-easter-effect');
        } else {
            document.body.classList.remove('easter-egg-cursor');
            document.body.classList.remove('tailwind-easter-effect');
            // Ne pas arrêter la musique ici, elle est gérée par le timeout dédié
        }
    }, [isEasterActive]);

    const renderActiveComponent = () => {
        switch(activeTab) {
            case 'personnages': return <Personnages />;
            case 'robots': return <Robots />;
            case 'armes': return <Armes />;
            case 'episodes': return <Episodes />;
            case 'monstres': return <Monstres />;
            case 'vaisseaux': return <Vaisseaux />;
            default: return <Personnages />;
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

            {/* En-tête principal avec logo + lecteur */}
            <header className="header" style={{ position: 'relative' }}>
                <div className="logo-container">
                    <img
                        src={GrendizerLogo}
                        alt="Goldorak Database"
                        className="logo-image"
                    />
                </div>
                <p>Base de données complète de l'univers Goldorak</p>

                {/* Lecteur musical discrètement en haut à droite */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 10
                }}>
                    <MusicPlayer />
                </div>
            </header>

            {/* Audio pour l'easter egg */}
            <audio ref={audioRef} src="/assets/Goldorak-est-mort.mp3" preload="auto" />

            {/* Overlay image easter egg */}
            {showEasterImage && (
                <div className="easter-egg-overlay" onClick={() => setShowEasterImage(false)}>
                    <img src="/assets/easterEGG2.png" alt="Easter Egg" className="easter-egg-image" />
                </div>
            )}

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