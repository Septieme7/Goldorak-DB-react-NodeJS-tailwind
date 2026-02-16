// components/Modal.jsx
import { useState, useEffect } from 'react';
import { useFormFields, getDefaultData } from '../hooks/useFormFields';
import { useReferenceData } from '../hooks/useReferenceData';
import './Modal.css';

function Modal({ item, type, endpoint, onSave, onClose }) {
    const [formData, setFormData] = useState(getDefaultData(endpoint));
    const fields = useFormFields(endpoint);
    const references = useReferenceData();

    // Initialiser formData avec les valeurs de l'item ou des valeurs par défaut
    useEffect(() => {
        if (item && Object.keys(item).length > 0) {
            // S'assurer que tous les champs sont présents
            const initialData = { ...getDefaultData(endpoint), ...item };
            setFormData(initialData);
        } else {
            setFormData(getDefaultData(endpoint));
        }
    }, [item, endpoint]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let processedValue = value;

        if (type === 'number') {
            processedValue = value === '' ? null : Number(value);
        } else if (type === 'date') {
            processedValue = value;
        } else if (type === 'select-one') {
            // Pour les selects, convertir chaîne vide en null
            processedValue = value === '' ? null : value;
        }

        setFormData({
            ...formData,
            [name]: processedValue
        });
    };

    const handleTextareaChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation des champs requis
        const requiredFields = fields.filter(field => field.required);
        const missingFields = requiredFields.filter(field =>
            !formData[field.name] && formData[field.name] !== 0
        );

        if (missingFields.length > 0) {
            alert(`Veuillez remplir les champs obligatoires : ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

        onSave(formData);
    };

    const renderField = (field) => {
        try {
            const { name, label, type: fieldType, required, min, max, reference, displayField, valueField, options, allowNone } = field;
            // Pour les selects, on doit garantir une chaîne vide au lieu de null/undefined
            let value = formData[name];
            if (fieldType === 'select' && (value === null || value === undefined)) {
                value = '';
            } else if (value === null || value === undefined) {
                value = '';
            }
            const isView = type === 'view';

        if (isView) {
            return (
                <div key={name} className="form-field">
                    <label htmlFor={name}><strong>{label}</strong>{required && ' *'}</label>
                    <div className="view-field">
                        {fieldType === 'textarea' ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{value || '-'}</div>
                        ) : fieldType === 'select' && reference ? (
                            // Afficher le nom référencé au lieu de l'ID
                            (() => {
                                const refData = references[reference];
                                const refItem = refData?.find(item => item[valueField] === value);
                                return refItem ? refItem[displayField] : (value || '-');
                            })()
                        ) : (
                            value || '-'
                        )}
                    </div>
                </div>
            );
        }

        if (fieldType === 'textarea') {
            return (
                <div key={name} className="form-field">
                    <label htmlFor={name}>{label}{required && ' *'}</label>
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={handleTextareaChange}
                        rows={4}
                        disabled={isView}
                        required={required}
                        placeholder={`Entrez ${label.toLowerCase()}...`}
                    />
                </div>
            );
        }

        if (fieldType === 'select') {
            // Select avec options statiques
            if (options) {
                return (
                    <div key={name} className="form-field">
                        <label htmlFor={name}>{label}{required && ' *'}</label>
                        <select
                            id={name}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            disabled={isView}
                            required={required}
                        >
                            {allowNone && <option value="">-- Aucun --</option>}
                            {options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            }

            // Select avec données de référence
            if (reference) {
                const refData = references[reference];
                const refDataArray = Array.isArray(refData) ? refData : [];

                return (
                    <div key={name} className="form-field">
                        <label htmlFor={name}>{label}{required && ' *'}</label>
                        <select
                            id={name}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            disabled={isView || references.loading}
                            required={required}
                        >
                            {allowNone && <option value="">-- Aucun --</option>}
                            {refDataArray.length > 0 ? (
                                refDataArray.map(item => (
                                    <option key={item[valueField]} value={item[valueField]}>
                                        ID {item[valueField]} = {item[displayField]}
                                    </option>
                                ))
                            ) : (
                                !references.loading && <option value="" disabled>Aucune donnée disponible</option>
                            )}
                        </select>
                        {references.loading && <small style={{ color: '#888' }}>Chargement...</small>}
                        {references.error && <small style={{ color: 'red' }}>Erreur: {references.error}</small>}
                    </div>
                );
            }
        }

        return (
            <div key={name} className="form-field">
                <label htmlFor={name}>{label}{required && ' *'}</label>
                <input
                    type={fieldType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={isView}
                    required={required}
                    min={min}
                    max={max}
                    step={fieldType === 'number' ? 'any' : undefined}
                    placeholder={`Entrez ${label.toLowerCase()}...`}
                />
            </div>
        );
        } catch (error) {
            console.error('Erreur lors du rendu du champ:', field, error);
            return (
                <div key={field.name} className="form-field">
                    <label>{field.label}</label>
                    <div style={{ color: 'red' }}>Erreur: {error.message}</div>
                </div>
            );
        }
    };

    // Fonction pour obtenir un titre personnalisé selon le endpoint
    const getModalTitle = () => {
        const baseTitle = type === 'view' ? 'Détails' : type === 'edit' ? 'Modifier' : 'Créer';

        // Titres personnalisés pour certains endpoints
        const customTitles = {
            'armes': 'Armes de Goldorak',
            'personnages': 'Personnages',
            'robots': 'Robots',
            'episodes': 'Épisodes',
            'monstres': 'Monstres',
            'vaisseaux': 'Vaisseaux'
        };

        if (type === 'view' && customTitles[endpoint.toLowerCase()]) {
            return customTitles[endpoint.toLowerCase()];
        }

        return `${baseTitle} ${endpoint}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{getModalTitle()}</h2>
                <form onSubmit={handleSubmit} className="modal-body">
                    {fields.length > 0 ? (
                        fields.map(renderField)
                    ) : (
                        <p className="no-fields">Aucun champ configuré pour cet endpoint.</p>
                    )}
                    <div className="modal-actions">
                        {type !== 'view' && (
                            <button type="submit" className="btn-save">
                                {type === 'create' ? 'Créer' : 'Mettre à jour'}
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="btn-close">
                            {type === 'view' ? 'Fermer' : 'Annuler'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;