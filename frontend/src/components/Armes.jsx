import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import './Components.css';

function Armes() {
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
    } = useFetchData('armes');

    const getFrequenceClass = (frequence) => {
        const classes = {
            'Très Fréquente': 'badge-frequent',
            'Fréquente': 'badge-frequent',
            'Occasionnelle': 'badge-neutral',
            'Assez Rare': 'badge-rare',
            'Rare': 'badge-rare',
            'Très Rare': 'badge-rare'
        };
        return classes[frequence] || '';
    };

    if (loading) return <div className="loading">Chargement des armes...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>⚔️ Armes de Goldorak</h2>
                <div className="header-actions">
                    <button onClick={handleCreate} className="btn-create">
                        ➕ Nouvelle arme
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
                        <th>Robot</th>
                        <th>Puissance</th>
                        <th>Fréquence</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(arme => (
                        <tr key={arme.id}>
                            <td>{arme.id}</td>
                            <td><strong>{arme.nom_fr}</strong></td>
                            <td>{arme.nom_jp || '-'}</td>
                            <td>{arme.robot_nom_fr || '-'}</td>
                            <td>{arme.puissance || '-'}</td>
                            <td>
                                {arme.frequence_utilisation && (
                                    <span className={`badge ${getFrequenceClass(arme.frequence_utilisation)}`}>
                                        {arme.frequence_utilisation}
                                    </span>
                                )}
                            </td>
                            <td className="description-cell">
                                {arme.description ? `${arme.description.substring(0, 60)}...` : '-'}
                            </td>
                            <td className="actions">
                                <button
                                    onClick={() => handleEdit(arme)}
                                    className="btn-action btn-edit"
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(arme.id, arme.nom_fr)}
                                    className="btn-action btn-delete"
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={() => handleView(arme)}
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
                        <strong>Total:</strong> {data.length} armes
                    </span>
                    <span className="stat-item">
                        <strong>Armes Goldorak:</strong> {data.filter(a => a.robot_nom_fr === 'Goldorak').length}
                    </span>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="armes"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Armes;