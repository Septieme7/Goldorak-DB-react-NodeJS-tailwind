// components/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer le token depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
            console.error('Erreur d\'authentification:', error);
            alert('Erreur lors de l\'authentification. Veuillez réessayer.');
            navigate('/login');
            return;
        }

        if (token) {
            // Stocker le token dans localStorage
            localStorage.setItem('auth_token', token);

            // Vérifier le token
            verifyToken(token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const verifyToken = async (token) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Utilisateur authentifié:', data.user);

                // Stocker les infos utilisateur
                localStorage.setItem('user', JSON.stringify(data.user));

                // Rediriger vers la page principale
                navigate('/');
            } else {
                throw new Error('Token invalide');
            }
        } catch (error) {
            console.error('Erreur de vérification du token:', error);
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                textAlign: 'center'
            }}>
                <div className="loading-spinner"></div>
                <h2 style={{ marginTop: '20px', color: '#2d3748' }}>
                    Authentification en cours...
                </h2>
                <p style={{ color: '#718096' }}>
                    Veuillez patienter
                </p>
            </div>
        </div>
    );
}

export default AuthCallback;
