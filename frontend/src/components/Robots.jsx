import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import './Components.css';

function Robots() {
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
    } = useFetchData('robots');

    const getTypeClass = (type) => {
        const classes = {
            'Robot de combat': 'badge-danger',
            'Robot transformable': 'badge-warning',
            'Robot de transport': 'badge-info',
            'Robot de reconnaissance': 'badge-secondary',
            'Robot de sauvetage': 'badge-success'
        };
        return classes[type] || 'badge-light';
    };

    if (loading) return <div className="loading">Chargement des robots...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>🤖 Robots & Méchas</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouveau robot
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
                        <th>Hauteur</th>
                        <th>Poids</th>
                        <th>Pilote</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(robot => (
                        <tr key={robot.id}>
                            <td>{robot.id}</td>
                            <td><strong>{robot.nom_fr}</strong></td>
                            <td>{robot.nom_jp || '-'}</td>
                            <td>
                                {robot.type_robot && (
                                    <span className={`badge ${getTypeClass(robot.type_robot)}`}>
                                        {robot.type_robot}
                                    </span>
                                )}
                            </td>
                            <td>{robot.hauteur ? `${robot.hauteur}m` : '-'}</td>
                            <td>{robot.poids ? `${robot.poids}t` : '-'}</td>
                            <td>{robot.personnage_nom_fr || 'Automatique'}</td>
                            <td className="description-cell">
                                {robot.description ? `${robot.description.substring(0, 60)}...` : '-'}
                            </td>
                            <td className="actions">
                                <button
                                    onClick={() => handleEdit(robot)}
                                    className="btn-action btn-edit"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(robot.id, robot.nom_fr)}
                                    className="btn-action btn-delete"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={() => handleView(robot)}
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
                        <strong>Total:</strong> {data.length} robots
                    </span>
                    <span className="stat-item">
                        <strong>Goldorak:</strong> {data.filter(r => r.nom_fr && r.nom_fr.includes('Goldorak')).length}
                    </span>
                    <span className="stat-item">
                        <strong>Avec pilote:</strong> {data.filter(r => r.personnage_id).length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="robots"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Robots;