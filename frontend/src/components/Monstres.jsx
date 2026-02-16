import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import DescriptionCell from './DescriptionCell';
import './Components.css';

function Monstres() {
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
    } = useFetchData('monstres');

    const getType = (nom_fr) => {
        if (!nom_fr) return 'Inconnu';
        if (nom_fr.includes('Gomora')) return 'Robot';
        if (nom_fr.includes('Véga')) return 'Vaisseau';
        return 'Monstre';
    };

    if (loading) return <div className="loading">Chargement des monstres...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>🐉 Monstres & Véga</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouveau monstre
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
                        <th>ID</th>
                        <th>Nom FR</th>
                        <th>Nom JP</th>
                        <th>Épisode</th>
                        <th>Type</th>
                        <th>Taille</th>
                        <th>Puissance</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(monstre => {
                        const type = getType(monstre.nom_fr);
                        return (
                            <tr key={monstre.id}>
                                <td>{monstre.id}</td>
                                <td><strong>{monstre.nom_fr || 'Sans nom'}</strong></td>
                                <td>{monstre.nom_jp || '-'}</td>
                                <td>
                                    {monstre.episode_titre_fr ? (
                                        <button className="episode-link">
                                            {monstre.episode_numero_fr || monstre.episode_numero_jp}: {monstre.episode_titre_fr.substring(0, 30)}...
                                        </button>
                                    ) : '-'}
                                </td>
                                <td>
                                    <span className="badge-type">
                                        {monstre.type_monstre || type}
                                    </span>
                                </td>
                                <td>{monstre.taille ? `${monstre.taille}m` : '-'}</td>
                                <td>{monstre.puissance || '-'}</td>
                                <td>
                                    <DescriptionCell description={monstre.description} maxLength={80} />
                                </td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEdit(monstre)}
                                        className="btn-action btn-edit"
                                        title="Modifier"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(monstre.id, monstre.nom_fr)}
                                        className="btn-action btn-delete"
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                    <button
                                        onClick={() => handleView(monstre)}
                                        className="btn-action btn-info"
                                        title="Détails"
                                    >
                                        ℹ️
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="component-footer">
                <div className="stats">
                    <span className="stat-item">
                        <strong>Total:</strong> {data.length} monstres/vaisseaux
                    </span>
                    <span className="stat-item">
                        <strong>Avec épisode:</strong> {data.filter(m => m.episode_id).length}
                    </span>
                    <span className="stat-item">
                        <strong>Sans épisode:</strong> {data.filter(m => !m.episode_id).length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="monstres"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Monstres;