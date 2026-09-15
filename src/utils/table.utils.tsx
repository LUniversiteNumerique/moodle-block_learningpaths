import * as React from 'react';
import type { ResourceData } from '../types/Data';
import MoodleIcon from '../utils/moodle.png';

// État global partagé entre toutes les instances de ResourceInfo
let activeResourceInfoId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

const setActiveResourceInfo = (id: string | null) => {
    activeResourceInfoId = id;
    listeners.forEach(listener => listener(id));
};

let idCounter = 0;

const ResourceInfo = ({ info }: { info: string }) => {
    const [id] = React.useState(() => `resource-info-${idCounter++}`);
    const [activeId, setActiveId] = React.useState<string | null>(activeResourceInfoId);

    React.useEffect(() => {
        listeners.add(setActiveId);
        return () => {
            listeners.delete(setActiveId);
            // Si ce tooltip était actif au démontage, on nettoie l'état global
            if (activeResourceInfoId === id) {
                setActiveResourceInfo(null);
            }
        };
    }, [id]);

    const visible = activeId === id;

    return (
        <span className="resource-info-container">
            <button
                type="button"
                className="resource-info"
                onClick={() => setActiveResourceInfo(visible ? null : id)}
                aria-label="Afficher les informations"
                aria-expanded={visible}
            >
                i
            </button>

            {visible && (
                <span className="resource-info-tooltip">
                    {info}
                </span>
            )}
        </span>
    );
};

export const createHeader = (obj: Object): JSX.Element[] => {
    return Object.entries(obj).map(([_, v]) => <div className="cell th">{v}</div>);
}

export const createRow = (
    object: ResourceData,
    name: string
): JSX.Element => {
    const keys = Object.keys(object)
        .filter(key =>
            key !== 'url' &&
            key !== 'moodle' &&
            key !== 'creationdate' &&
            key !== 'info'
        );

    const licenceIndex = keys.indexOf('licence');

    if (licenceIndex !== -1) {
        keys.splice(licenceIndex, 0, 'creationdate');
    } else {
        keys.push('creationdate');
    }   

    const rows = keys.map(key => {
        return (
            <div className={`cell lpb-${name}-${key}`}>
                {
                    key === 'name'
                        ? <>
                            {object.moodle && (
                                <span className="moodle-badge">
                                    <img
                                        src={MoodleIcon}
                                        alt="Moodle"
                                        className="moodle-icon"
                                        height="18"
                                    />
                                </span>
                            )}
                            <a
                                href={object.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {object.name}
                            </a>
                            {typeof object.info === 'string' && object.info.trim() !== '' && (
                                <ResourceInfo info={object.info} />
                            )}
                        </>
                        : key === 'licence'
                            ? object[key] != null
                                ? Object.values(object[key]).map((licence: any) =>
                                    licence.image
                                        ? <img
                                            src={licence.image}
                                            width="80"
                                            title={licence.name}
                                            alt={licence.name}
                                        />
                                        : <span className="text-small">
                                            {licence.name}
                                        </span>
                                )
                                : ""
                            : key === 'creationdate'
                                ? object[key] ?? ''
                                : object[key]
                }
            </div>
        );
    });

    return <div className="column">{rows}</div>;
};
