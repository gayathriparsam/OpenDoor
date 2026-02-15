import React from 'react';

const SentimentGauge = ({ score }) => {
    // score is 0 to 100
    let label = 'Neutral';
    let color = '#94a3b8'; // Slate 400

    if (score < 30) {
        label = 'Cold / Uninterested';
        color = '#ef4444'; // Red 500
    } else if (score < 50) {
        label = 'Curious';
        color = '#f59e0b'; // Amber 500
    } else if (score < 80) {
        label = 'Interested';
        color = '#3b82f6'; // Blue 500
    } else {
        label = 'Hot / Urgent';
        color = '#10b981'; // Emerald 500
    }

    return (
        <div className="sentiment-gauge-container" style={{ marginBottom: '15px' }}>
            <div className="flex-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary)' }}>Lead Sentiment</span>
                <span className="text-xs font-bold" style={{ color }}>{label}</span>
            </div>
            <div className="gauge-bg" style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div
                    className="gauge-fill"
                    style={{
                        height: '100%',
                        width: `${score}%`,
                        background: color,
                        transition: 'width 0.5s ease, background-color 0.5s ease',
                        boxShadow: `0 0 10px ${color}44`
                    }}
                ></div>
            </div>
            <div className="flex-between mt-1 px-1">
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Cold</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Warm</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Hot</span>
            </div>
        </div>
    );
};

export default SentimentGauge;
