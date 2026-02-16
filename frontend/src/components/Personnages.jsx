import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import DescriptionCell from './DescriptionCell';
import './Components.css';

function Personnages() {
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
    } = useFetchData('personnages');

    const getFactionClass = (faction) => {
        const factions = {
            'Terre': 'faction-terre',
            'Véga': 'faction-vega',
            'Neutre': 'faction-neutral'
        };
        return factions[faction] || 'faction-neutral';
    };

    if (loading) return <div className="loading">Chargement des personnages...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>👥 Personnages de Goldorak</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouveau personnage
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
                        <th>Faction</th>
                        <th>Rôle</th>
                        <th>Âge</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(personnage => (
                        <tr key={personnage.id}>
                            <td>{personnage.id}</td>
                            <td><strong>{personnage.nom_fr}</strong></td>
                            <td>{personnage.nom_jp || '-'}</td>
                            <td>
                                <span className={`faction ${getFactionClass(personnage.faction)}`}>
                                    {personnage.faction || 'Inconnu'}
                                </span>
                            </td>
                            <td>{personnage.role || '-'}</td>
                            <td>{personnage.age || '-'}</td>
                            <td>
                                <DescriptionCell description={personnage.description} maxLength={70} />
                            </td>
                            <td className="actions">
                                <button
                                    onClick={() => handleEdit(personnage)}
                                    className="btn-action btn-edit"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(personnage.id, personnage.nom_fr)}
                                    className="btn-action btn-delete"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={() => handleView(personnage)}
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
                        <strong>Total:</strong> {data.length} personnages
                    </span>
                    <span className="stat-item">
                        <strong>Terre:</strong> {data.filter(p => p.faction === 'Terre').length}
                    </span>
                    <span className="stat-item">
                        <strong>Véga:</strong> {data.filter(p => p.faction === 'Véga').length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="personnages"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Personnages;