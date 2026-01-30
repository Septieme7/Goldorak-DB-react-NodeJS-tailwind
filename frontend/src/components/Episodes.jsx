import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import './Components.css';

function Episodes() {
    const {
        data,
        loading,
        error,
        refetch,
        handleView,
        handleEdit,
        handleDelete,
        handleCreate,
        handleSave,
        selectedItem,
        modalType,
        showModal,
        setShowModal
    } = useFetchData('episodes');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const getSaison = (numero_jp) => {
        if (!numero_jp) return 'Inconnu';
        if (numero_jp <= 26) return 'Saison 1';
        if (numero_jp <= 52) return 'Saison 2';
        return 'Saison 3';
    };

    if (loading) return <div className="loading">Chargement des épisodes...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>📺 Épisodes de Goldorak</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouvel épisode
                    </button>
                    <button onClick={refetch} className="btn-refresh">
                        🔄 Actualiser
                    </button>
                </div>
            </div>

            <div className="table-scroll">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Saison</th>
                        <th>JP</th>
                        <th>FR</th>
                        <th>Titre FR</th>
                        <th>Titre JP</th>
                        <th>Diffusion JP</th>
                        <th>Diffusion FR</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(episode => (
                        <tr key={episode.id}>
                            <td>
                                <span className="badge-saison">
                                    {getSaison(episode.numero_jp)}
                                </span>
                            </td>
                            <td>{episode.numero_jp || '-'}</td>
                            <td>{episode.numero_fr || '-'}</td>
                            <td><strong>{episode.titre_fr || 'Sans titre'}</strong></td>
                            <td>{episode.titre_jp || '-'}</td>
                            <td>{formatDate(episode.diffuse_jp)}</td>
                            <td>{formatDate(episode.diffuse_fr)}</td>
                            <td>
                                <span className={`badge ${episode.numero_fr ? 'badge-success' : 'badge-warning'}`}>
                                    {episode.numero_fr ? 'Diffusé FR' : 'Non diffusé'}
                                </span>
                            </td>
                            <td className="actions">
                                <button
                                    onClick={() => handleEdit(episode)}
                                    className="btn-action btn-edit"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleView(episode)}
                                    className="btn-action btn-info"
                                    title="Détails"
                                >
                                    ℹ️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="component-footer">
                <div className="stats">
                    <span className="stat-item">
                        <strong>Total:</strong> {data.length} épisodes
                    </span>
                    <span className="stat-item">
                        <strong>Diffusés FR:</strong> {data.filter(e => e.numero_fr).length}
                    </span>
                    <span className="stat-item">
                        <strong>Non diffusés:</strong> {data.filter(e => !e.numero_fr).length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="episodes"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Episodes;