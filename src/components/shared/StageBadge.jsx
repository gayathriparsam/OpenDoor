import React from 'react';
import clsx from 'clsx';
import '../../styles/components.css';

const StageBadge = ({ stage }) => {
    const getStageColor = (s) => {
        switch (s?.toLowerCase()) {
            case 'new': return 'badge-info';
            case 'qualified': return 'badge-success';
            case 'follow-up': return 'badge-warning';
            case 'closed': return 'badge-danger';
            default: return 'badge-neutral';
        }
    };

    return (
        <span className={clsx('stage-badge', getStageColor(stage))}>
            <span className="dot"></span>
            {stage || 'Unknown'}
        </span>
    );
};

export default StageBadge;
