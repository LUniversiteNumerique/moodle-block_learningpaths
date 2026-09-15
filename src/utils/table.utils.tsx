import * as React from 'react';
import type { ResourceData } from '../types/Data';
import MoodleIcon from '../utils/moodle.png';

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
                                <span
                                    className="resource-info"
                                    title={object.info}
                                >
                                    i
                                </span>
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
