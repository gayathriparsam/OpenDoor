import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import StageBadge from '../shared/StageBadge';
import ReadinessScore from '../shared/ReadinessScore';

const LeadList = ({ selectedId, onSelect }) => {
    const { leads } = useLeads();
    const [filter, setFilter] = useState('All');

    const filteredLeads = leads.filter(l =>
        filter === 'All' || l.stage === filter
    );

    return (
        <div className="lead-list-panel glass-panel">
            <div className="list-header">
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Search leads..." className="search-input" />
                </div>
                <div className="filter-row">
                    {['All', 'New', 'Qualified', 'Stale'].map(f => (
                        <button
                            key={f}
                            className={`filter-chip ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="leads-container">
                {filteredLeads.map(lead => (
                    <div
                        key={lead.id}
                        className={`lead-item ${selectedId === lead.id ? 'selected' : ''}`}
                        onClick={() => onSelect(lead)}
                    >
                        <div className="flex-between">
                            <span className="lead-name">{lead.name}</span>
                            <span className="text-xs text-tertiary">{lead.lastContacted}</span>
                        </div>
                        <div className="flex-between mt-1">
                            <StageBadge stage={lead.stage} />
                            <div style={{ width: '140px' }}>
                                <ReadinessScore score={lead.score} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadList;
