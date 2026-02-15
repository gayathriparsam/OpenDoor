import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import StageBadge from '../shared/StageBadge';
import ReadinessScore from '../shared/ReadinessScore';

const CRMSnapshot = () => {
    const { lead } = useCall();

    return (
        <div className="crm-snapshot">
            {/* A) Lead Summary */}
            <div className="crm-card summary-card">
                <div className="flex-between mb-2">
                    <span className="font-bold text-lg">{lead.id}</span>
                    <span className="text-xs text-secondary">{lead.lastContacted}</span>
                </div>
                <div className="flex-between mb-3">
                    <span className="font-medium">{lead.name}</span>
                    <StageBadge stage={lead.stage} />
                </div>
                {/* Use dynamic AI Score if available, else static */}
                <ReadinessScore score={lead.readiness_score || lead.score} />
            </div>

            {/* B) Qualification Completeness */}
            <div className="crm-card">
                <div className="card-title">Qualification Checklist</div>
                <div className="checklist-grid">
                    {Object.entries(lead.checklist).map(([key, checked]) => (
                        <div key={key} className={`check-item ${checked ? 'checked' : ''}`}>
                            {checked ? <CheckCircle2 size={16} className="text-success" /> : <Circle size={16} className="text-gray-300" />}
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* C) Lead Profile */}
            <div className="crm-card">
                <div className="card-title">Lead Profile</div>
                <div className="profile-grid">
                    <div className="profile-item">
                        <span className="label">Finance</span>
                        <span className="value">{lead.financing?.type || 'Unknown'}</span>
                    </div>
                    <div className="profile-item">
                        <span className="label">Budget</span>
                        <span className="value">${(lead.budget.min / 1000)}k - ${(lead.budget.max / 1000)}k</span>
                    </div>
                    <div className="profile-item">
                        <span className="label">Timeline</span>
                        <span className="value">{lead.timeline}</span>
                    </div>
                    <div className="profile-item">
                        <span className="label">Motivation</span>
                        <span className="text-xs value text-ellipsis">{lead.motivation || 'Unclear'}</span>
                    </div>
                </div>
            </div>

            {/* D) Appointment Card */}
            <div className={`crm-card ${lead.appointment.status === 'confirmed' ? 'highlight-success' : ''}`}>
                <div className="card-title">
                    Appointment
                    <span className={`status-pill ${lead.appointment.status}`}>{lead.appointment.status}</span>
                </div>
                {lead.appointment.proposedSlots.length > 0 && (
                    <div className="slots-area">
                        {lead.appointment.proposedSlots.map(slot => (
                            <span key={slot} className={`slot-chip ${lead.appointment.confirmedSlot === slot ? 'confirmed' : ''}`}>
                                <Calendar size={12} />
                                {slot}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* F) Matching Properties (New Wow Feature) */}
            <div className="crm-card properties-card">
                <div className="card-title">Matching Properties in {lead.location || 'Area'}</div>
                <div className="flex flex-col gap-3 mt-2">
                    <div className="property-item glass-panel overflow-hidden">
                        <img
                            src={lead.location === 'Downtown' ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400"}
                            alt="Property"
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                        />
                        <div className="p-2">
                            <div className="flex-between">
                                <span className="font-bold text-xs">{lead.location === 'Downtown' ? 'Modern 2BHK Loft' : 'Luxury 3BHK Villa'}</span>
                                <span className="text-primary font-bold text-xs">${lead.location === 'Downtown' ? '450,000' : '750,000'}</span>
                            </div>
                            <div className="text-[10px] text-secondary mt-1">
                                {lead.location === 'Downtown' ? 'Downtown Central • 1,200 sqft' : 'Westlake Estates • 2,400 sqft'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* E) Next Best Action */}
            <div className="crm-card action-card">
                <div className="card-title text-primary">Next Best Action</div>
                <div className="action-text">
                    {lead.nextAction}
                </div>
            </div>
        </div>
    );
};

export default CRMSnapshot;
