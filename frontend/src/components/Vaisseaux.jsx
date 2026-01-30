import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import './Components.css';

function Vaisseaux() {
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
    } = useFetchData('vaisseaux');

    const getTypeClass = (type) => {
        const classes = {
            'Vaisseau-mère': 'badge-primary',
            'Croiseur de combat': 'badge-danger',
            'Vaisseau de combat': 'badge-warning',
            'Char d\'assaut': 'badge-info',
            'Submersible': 'badge-success',
            'Vaisseau de reconnaissance': 'badge-secondary',
            'Vaisseau de recherche': 'badge-light',
            'Vaisseau expérimental': 'badge-dark'
        };
        return classes[type] || 'badge-secondary';
    };

    const getFaction = (nom) => {
        return nom && nom.includes('Véga') ? 'Véga' : 'Terre';
    };

    if (loading) return <div className="loading">Chargement des vaisseaux...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>🚀 Vaisseaux & Spacers</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouveau vaisseau
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
                        <th>Type</th>
                        <th>Pilote</th>
                        <th>Faction</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(vaisseau => {
                        const faction = getFaction(vaisseau.nom_fr);
                        return (
                            <tr key={vaisseau.id}>
                                <td>{vaisseau.id}</td>
                                <td><strong>{vaisseau.nom_fr}</strong></td>
                                <td>{vaisseau.nom_jp || '-'}</td>
                                <td>
                                    {vaisseau.type_vaisseau && (
                                        <span className={`badge ${getTypeClass(vaisseau.type_vaisseau)}`}>
                                            {vaisseau.type_vaisseau}
                                        </span>
                                    )}
                                </td>
                                <td>{vaisseau.pilote_nom_fr || 'Automatique'}</td>
                                <td>
                                    <span className={`faction ${faction === 'Véga' ? 'faction-vega' : 'faction-terre'}`}>
                                        {faction}
                                    </span>
                                </td>
                                <td className="description-cell">
                                    {vaisseau.description ? `${vaisseau.description.substring(0, 70)}...` : '-'}
                                </td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEdit(vaisseau)}
                                        className="btn-action btn-edit"
                                        title="Modifier"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vaisseau.id, vaisseau.nom_fr)}
                                        className="btn-action btn-delete"
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                    <button
                                        onClick={() => handleView(vaisseau)}
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
                        <strong>Total:</strong> {data.length} vaisseaux
                    </span>
                    <span className="stat-item">
                        <strong>Terre:</strong> {data.filter(v => getFaction(v.nom_fr) === 'Terre').length}
                    </span>
                    <span className="stat-item">
                        <strong>Véga:</strong> {data.filter(v => getFaction(v.nom_fr) === 'Véga').length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="vaisseaux"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Vaisseaux;