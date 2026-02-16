import { useState, useEffect, useRef } from 'react';
import './Components.css';

function DescriptionCell({ description, maxLength = 60 }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const containerRef = useRef(null);

    // Afficher un tiret si pas de description
    if (!description || description.trim() === '') {
        return <span style={{ color: '#888' }}>-</span>;
    }

    const truncated = description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description;

    const needsTooltip = description.length > maxLength;

    const handleClick = (e) => {
        if (needsTooltip) {
            e.stopPropagation();
            setShowTooltip(true);
        }
    };

    const handleClose = () => {
        setShowTooltip(false);
    };

    // Fermer le tooltip lors du scroll
    useEffect(() => {
        const handleScroll = () => {
            if (showTooltip) {
                setShowTooltip(false);
            }
        };

        // Ajouter l'écouteur sur tous les conteneurs scrollables
        const scrollableParent = containerRef.current?.closest('.table-scroll');
        if (scrollableParent) {
            scrollableParent.addEventListener('scroll', handleScroll);
        }

        // Ajouter aussi sur window pour le scroll global
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            if (scrollableParent) {
                scrollableParent.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [showTooltip]);

    // Fermer le tooltip si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showTooltip && !e.target.closest('.description-tooltip') && !e.target.closest('.description-cell')) {
                setShowTooltip(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showTooltip]);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <div
                className="description-cell"
                onClick={handleClick}
                style={{ cursor: needsTooltip ? 'pointer' : 'default' }}
                title={needsTooltip ? 'Cliquer pour voir le texte complet' : ''}
            >
                {truncated}
            </div>
            {showTooltip && (
                <>
                    <div className="description-overlay" onClick={handleClose} />
                    <div className="description-tooltip">
                        <span className="description-close" onClick={handleClose}>
                            ✕
                        </span>
                        <div className="description-tooltip-title">Description complète</div>
                        <div className="description-tooltip-content">{description}</div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DescriptionCell;
