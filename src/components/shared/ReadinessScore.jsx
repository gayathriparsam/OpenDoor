import React from 'react';
import '../../styles/components.css';

const ReadinessScore = ({ score }) => {
    // Color gradient based on score
    const getColor = (s) => {
        if (s >= 80) return 'var(--color-success)';
        if (s >= 50) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    const color = getColor(score);

    return (
        <div className="readiness-meter">
            <div className="meter-label">
                <span className="text-xs text-secondary">Readiness</span>
                <span className="font-bold" style={{ color }}>{score}%</span>
            </div>
            <div className="progress-bg">
                <div
                    className="progress-fill"
                    style={{ width: `${score}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};

export default ReadinessScore;
