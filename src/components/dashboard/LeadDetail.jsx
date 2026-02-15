import React, { useState } from 'react';
import { Download, Calendar, AlertTriangle, ShieldAlert, History, MapPin, User, CheckCircle, Clock } from 'lucide-react';
import StageBadge from '../shared/StageBadge';
import ReadinessScore from '../shared/ReadinessScore';
import LeadScoringRadar from '../shared/LeadScoringRadar';

import { useLeads } from '../../context/LeadContext';

const LeadDetail = ({ lead }) => {
    const { updateLead } = useLeads();
    const [activeTab, setActiveTab] = useState('Profile');



    const [isScheduling, setIsScheduling] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        time: '',
        type: 'Property Viewing',
        notes: '',
        leadName: lead?.name || '',
        leadEmail: lead?.email || '',
        leadPhone: lead?.phone || '',
        leadType: lead?.intent || 'Buyer'
    });

    // Update local state when lead changes
    React.useEffect(() => {
        if (lead) {
            setNewAppointment(prev => ({
                ...prev,
                leadName: lead.name,
                leadEmail: lead.email,
                leadPhone: lead.phone,
                leadType: lead.intent
            }));
        }
    }, [lead]);

    const handleSaveAppointment = () => {
        if (!newAppointment.date || !newAppointment.time) {
            alert("Please select both date and time.");
            return;
        }

        const formattedSlot = `${newAppointment.date} at ${newAppointment.time}`;

        updateLead(lead.id, {
            appointment: {
                status: 'proposed',
                proposedSlots: [formattedSlot],
                confirmedSlot: null
            }
        });

        setIsScheduling(false);
        setNewAppointment({ date: '', time: '', type: 'Property Viewing', notes: '' });
        alert(`Invitation sent for: ${formattedSlot}`);
    };

    const handleConfirmAppointment = (slot) => {
        updateLead(lead.id, {
            appointment: {
                status: 'confirmed',
                proposedSlots: [],
                confirmedSlot: slot
            }
        });
    };

    const handleReschedule = () => {
        updateLead(lead.id, {
            appointment: {
                status: 'pending',
                proposedSlots: ['Next Mon, 10:00 AM'],
                confirmedSlot: null
            }
        });
    };

    if (!lead) return <div className="lead-detail-panel flex-center">Select a lead</div>;

    return (
        <div className="lead-detail-panel glass-panel">
            {/* Header */}
            <div className="detail-header">
                <div className="detail-top">
                    <div>
                        <div className="flex-center gap-2 mb-1">
                            <h2 className="lead-title">{lead.name}</h2>
                            <span className="text-sm text-tertiary">#LEAD-{lead.id}92</span>
                        </div>
                        <div className="flex-center gap-2">
                            <StageBadge stage={lead.stage} />
                            <span className="text-sm text-secondary">Last active: {lead.time}</span>
                        </div>
                    </div>

                </div>

                <div className="tabs-nav">
                    {['Profile', 'Conversation', 'Appointments', 'Insights', 'Traces'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeTab === 'Profile' && (
                    <div className="detail-grid">
                        <div className="crm-card">
                            <div className="card-title">Contact Info</div>
                            <div className="flex flex-col gap-3">
                                <div className="info-group">
                                    <label>Email</label>
                                    <input type="text" value={lead.email || "sarah.j@example.com"} readOnly />
                                </div>
                                <div className="info-group">
                                    <label>Phone</label>
                                    <input type="text" value={lead.phone || "+1 (555) 012-3456"} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Conversation' && (
                    <div className="conversation-view">
                        <div className="conv-header">
                            <span className="font-bold">Transcript History</span>
                            <button className="btn btn-ghost btn-sm"><Download size={14} /> CSV</button>
                        </div>
                        <div className="conv-messages">
                            <div className="message-bubble agent">
                                <div className="msg-content">Hi Sarah, looking for a condo?</div>
                            </div>
                            <div className="message-bubble user">
                                <div className="msg-content">Yes, in downtown area.</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Insights' && (
                    <div className="crm-card">
                        <h3>Call Analysis</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Strong intent signal detected in first 3 turns</li>
                            <li>Price sensitivity mentioning "market rates"</li>
                            <li>Requested weekend appointment specifically</li>
                        </ul>
                    </div>
                )}

                {activeTab === 'Appointments' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex-between">
                            <h3 className="font-bold">Scheduled Meetings</h3>
                            {!isScheduling && (
                                <button className="btn btn-primary btn-sm" onClick={() => setIsScheduling(true)}>
                                    <Calendar size={14} /> Schedule New
                                </button>
                            )}
                        </div>

                        {isScheduling && (
                            <div className="glass-panel p-4 border border-primary mb-4">
                                <h4 className="font-bold mb-3 text-sm">New Appointment Details</h4>
                                <div className="flex flex-col gap-3">
                                    {/* Lead Info First */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="info-group">
                                            <label>Lead Name</label>
                                            <input type="text" className="p-2 border rounded text-sm w-full bg-gray-50" value={newAppointment.leadName} readOnly />
                                        </div>
                                        <div className="info-group">
                                            <label>Contact Type</label>
                                            <input type="text" className="p-2 border rounded text-sm w-full bg-gray-50" value={newAppointment.leadType} readOnly />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="info-group">
                                            <label>Email</label>
                                            <input type="text" className="p-2 border rounded text-sm w-full bg-gray-50" value={newAppointment.leadEmail} readOnly />
                                        </div>
                                        <div className="info-group">
                                            <label>Phone</label>
                                            <input type="text" className="p-2 border rounded text-sm w-full bg-gray-50" value={newAppointment.leadPhone} readOnly />
                                        </div>
                                    </div>

                                    {/* Date & Time Second */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="info-group">
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                className="p-2 border rounded text-sm w-full"
                                                value={newAppointment.date}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="info-group">
                                            <label>Time</label>
                                            <input
                                                type="time"
                                                className="p-2 border rounded text-sm w-full"
                                                value={newAppointment.time}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Meeting Type Last */}
                                    <div className="info-group">
                                        <label>Meeting Type</label>
                                        <select
                                            className="p-2 border rounded text-sm w-full"
                                            value={newAppointment.type}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                        >
                                            <option>Property Viewing</option>
                                            <option>Consultation Call</option>
                                            <option>Open House</option>
                                            <option>Contract Signing</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 justify-end mt-2">
                                        <button className="btn btn-ghost btn-sm" onClick={() => setIsScheduling(false)}>Cancel</button>
                                        <button className="btn btn-primary btn-sm" onClick={handleSaveAppointment}>Send Invite</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Appointment List */}
                        <div className="appointments-list flex flex-col gap-3">
                            {lead.appointment?.status !== 'none' && (
                                <div className="appointment-card glass-panel p-3 flex-between border-primary border">
                                    <div className="flex gap-3 items-center">
                                        <div className="date-badge flex-col flex-center bg-primary text-white p-2 rounded" style={{ minWidth: '50px' }}>
                                            <span className="text-xs font-bold">LATEST</span>
                                            <span className="text-sm font-bold">ACTIVE</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Property Viewing</div>
                                            <div className="text-xs text-secondary flex items-center gap-1">
                                                <Clock size={12} /> {lead.appointment?.confirmedSlot || lead.appointment?.proposedSlots?.[0] || 'Scheduled'}
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-2">
                                                {lead.appointment?.status === 'proposed' && (
                                                    <button className="btn btn-xs btn-success text-xs px-2 py-0.5" onClick={() => handleConfirmAppointment(lead.appointment?.proposedSlots?.[0])}>Confirm</button>
                                                )}
                                                <button className="btn btn-xs btn-outline text-xs px-2 py-0.5" onClick={handleReschedule}>Reschedule</button>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${lead.appointment?.status.toLowerCase()} text-xs px-2 py-1 rounded-full border`}>
                                        {lead.appointment?.status}
                                    </span>
                                </div>
                            )}

                            {[
                                { id: 1, type: 'Property Tour', date: 'Tomorrow, 10:00 AM', loc: 'Downtown Lofts', status: 'Confirmed' },
                                { id: 2, type: 'Follow-up Call', date: 'Mon, Oct 27, 2:00 PM', loc: 'Phone', status: 'Pending' }
                            ].map(appt => (
                                <div key={appt.id} className="appointment-card glass-panel p-3 flex-between">
                                    <div className="flex gap-3 items-center">
                                        <div className="date-badge flex-col flex-center bg-primary-light text-primary p-2 rounded" style={{ minWidth: '50px' }}>
                                            <span className="text-xs font-bold">{appt.date.split(',')[0]}</span>
                                            <span className="text-sm font-bold">{appt.date.split(',')[1].trim().split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{appt.type}</div>
                                            <div className="text-xs text-secondary flex items-center gap-1">
                                                <MapPin size={12} /> {appt.loc}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${appt.status.toLowerCase()} text-xs px-2 py-1 rounded-full border`}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadDetail;
