import React from 'react';
import moment from 'moment';

function NoteItem({ noteData }) {
    const diff = moment.duration(moment(noteData.lastModified).diff(moment()));
    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                cursor: 'pointer',
                justifyContent: 'space-between',
                marginBottom: 3,
            }}
        >
            <div>{noteData.displayName}</div>
            <div
                style={{
                    color: 'grey',
                }}
            >
                {diff.humanize(true)}
            </div>
        </div>
    );
}

export default NoteItem;
