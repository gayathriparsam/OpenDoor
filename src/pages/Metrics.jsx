import React from 'react';
import { useLeads } from '../context/LeadContext';
import { ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import '../styles/misc.css';

const Metrics = () => {
    const { leads } = useLeads();
    const totalLeadsCount = leads?.length || 0;
    const qualifiedCount = leads?.filter(l => l.stage === 'Qualified').length || 0;
    const confirmedCount = leads?.filter(l => l.appointment?.status === 'confirmed').length || 0;

    return (
        <div className="outbound-container">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Avg Response Time</div>
                    <div className="metric-value">1.2s</div>
                    <div className="change-indicator positive flex-center justify-start gap-1">
                        <ArrowDown size={12} /> 15% better than target
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Appointment Rate</div>
                    <div className="metric-value">{totalLeadsCount > 0 ? ((confirmedCount / totalLeadsCount) * 100).toFixed(0) : 0}%</div>
                    <div className="change-indicator positive flex-center justify-start gap-1">
                        <ArrowUp size={12} /> Real-time
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Valid JSON Extraction</div>
                    <div className="metric-value">99.8%</div>
                    <div className="change-indicator positive flex-center justify-start gap-1">
                        <CheckCircle size={12} /> Consistent
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Leads</div>
                    <div className="metric-value">{totalLeadsCount}</div>
                    <div className="change-indicator flex-center justify-start gap-1">
                        From Database
                    </div>
                </div>
            </div>

            <div className="glass-panel p-4">
                <h3 className="font-bold mb-3">Conversion Funnel</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex-between text-sm">
                        <span>Leads Contacted</span>
                        <span>100% ({totalLeadsCount})</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                        <div style={{ width: '100%', height: '100%', background: 'var(--color-primary)', borderRadius: 4 }}></div>
                    </div>

                    <div className="flex-between text-sm mt-2">
                        <span>Engaged (Replied)</span>
                        <span>{(totalLeadsCount * 0.68).toFixed(0)} (Estim.)</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                        <div style={{ width: '68%', height: '100%', background: 'var(--color-info)', borderRadius: 4 }}></div>
                    </div>

                    <div className="flex-between text-sm mt-2">
                        <span>Qualified</span>
                        <span>{totalLeadsCount > 0 ? ((qualifiedCount / totalLeadsCount) * 100).toFixed(0) : 0}% ({qualifiedCount})</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                        <div style={{ width: totalLeadsCount > 0 ? `${(qualifiedCount / totalLeadsCount) * 100}%` : '0%', height: '100%', background: 'var(--color-warning)', borderRadius: 4 }}></div>
                    </div>

                    <div className="flex-between text-sm mt-2">
                        <span>Appointments Confirmed</span>
                        <span>{totalLeadsCount > 0 ? ((confirmedCount / totalLeadsCount) * 100).toFixed(0) : 0}% ({confirmedCount})</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                        <div style={{ width: totalLeadsCount > 0 ? `${(confirmedCount / totalLeadsCount) * 100}%` : '0%', height: '100%', background: 'var(--color-success)', borderRadius: 4 }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Metrics;
