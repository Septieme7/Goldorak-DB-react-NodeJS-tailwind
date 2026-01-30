// components/Modal.jsx
import { useState, useEffect } from 'react';
import { useFormFields, getDefaultData } from '../hooks/useFormFields';
import './Modal.css';

function Modal({ item, type, endpoint, onSave, onClose }) {
    const [formData, setFormData] = useState(getDefaultData(endpoint));
    const fields = useFormFields(endpoint);

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
            processedValue = value === '' ? '' : Number(value);
        } else if (type === 'date') {
            processedValue = value;
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
        const { name, label, type: fieldType, required, min, max } = field;
        const value = formData[name] || '';
        const isView = type === 'view';

        if (isView) {
            return (
                <div key={name} className="form-field">
                    <label htmlFor={name}><strong>{label}</strong>{required && ' *'}</label>
                    <div className="view-field">
                        {fieldType === 'textarea' ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{value || '-'}</div>
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
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {type === 'view' ? 'Détails' :
                        type === 'edit' ? 'Modifier' : 'Créer'} {endpoint}
                </h2>
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