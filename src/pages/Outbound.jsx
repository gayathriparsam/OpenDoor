import React, { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import {
    Send,
    CheckCircle,
    RefreshCw,
    Calendar,
    Bell,
    Mail,
    MessageSquare,
    Clock,
    Zap,
    Users,
    AlertCircle,
    TrendingUp,
    Layout
} from 'lucide-react';
import '../styles/misc.css';

const CAMPAIGN_TEMPLATES = {
    'Appointment Reminder': {
        label: 'Appointment Reminder (24h Before)',
        subject: 'Reminder: Your Property Viewing Tomorrow',
        icon: <Calendar size={18} className="text-orange-500" />,
        body: "Hi [Name],\n\nJust a friendly reminder that we have an appointment scheduled for tomorrow at [Time] for the property at [Location].\n\nI'll be there waiting for you. Please let me know if you need to reschedule!\n\nBest,\nThe OpenDoor Team",
        color: '#ff9800'
    },
    'New Listing Alert': {
        label: 'New Listing Alert (Location Match)',
        subject: 'New Hot Listing in [Location]!',
        icon: <Zap size={18} className="text-blue-500" />,
        body: "Hi [Name],\n\nA new property that perfectly matches your criteria has just hit the market in [Location].\n\nDetails:\n- Price: [Price]\n- Size: [Size]\n\nThis one is moving fast! Would you like to schedule a viewing?\n\nBest,\nThe OpenDoor Team",
        color: '#1565d8'
    },
    'Price Drop Alert': {
        label: 'Price Drop Alert',
        subject: 'Price Reduced: [Property Name]',
        icon: <TrendingUp size={18} className="text-green-500" />,
        body: "Hi [Name],\n\nGood news! The asking price for [Property Name] has just been reduced to [New Price].\n\nThis makes it an incredible value for the area. Are you still interested in taking a look?\n\nBest,\nThe OpenDoor Team",
        color: '#10b981'
    },
    'Meeting Scheduled': {
        label: 'Meeting Confirmation',
        subject: 'Confirmed: Property Discussion Meeting',
        icon: <CheckCircle size={18} className="text-blue-600" />,
        body: "Hi [Name],\n\nGreat news! Your meeting with our property specialist has been confirmed.\n\nTime: [Time]\nTopic: Real Estate Investment & Property Portfolio\n\nWe look forward to helping you find your dream home.\n\nBest,\nThe OpenDoor Team",
        color: '#2563eb'
    },
    'Re-engagement': {
        label: 'Re-engagement (Cold Lead)',
        subject: 'Still looking in [Location]?',
        icon: <RefreshCw size={18} className="text-purple-500" />,
        body: "Hi [Name],\n\nIt's been a little while since we last spoke. I noticed some great new opportunities in [Location] that might fit your search.\n\nAre you still in the market, or should I pause these updates for now?\n\nBest,\nThe OpenDoor Team",
        color: '#9c27b0'
    }
};

const Outbound = () => {
    const { leads: realLeads } = useLeads();
    const [running, setRunning] = useState(false);
    const [sentCount, setSentCount] = useState(0);
    const [campaignType, setCampaignType] = useState('Appointment Reminder');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync from LeadContext with enrichment for this page's needs
    useEffect(() => {
        if (realLeads) {
            const enrichedLeads = realLeads.map(l => ({
                ...l,
                email: l.email || `${l.name?.toLowerCase().replace(' ', '.')}@example.com`,
                location: l.location || 'Downtown',
                time: '10:00 AM', // Default for simulation
                lastContact: l.lastContacted || 'Recently'
            }));
            setLeads(enrichedLeads);
            setLoading(false);
        }
    }, [realLeads]);

    const handleRun = async () => {
        setRunning(true);
        setSentCount(0);

        const template = CAMPAIGN_TEMPLATES[campaignType];

        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];

            // Personalized body
            const personalizedBody = template.body
                .replace('[Name]', lead.name)
                .replace('[Location]', lead.location)
                .replace('[Time]', lead.time || '10:00 AM')
                .replace('[Property Name]', `${lead.location} Estate`);

            // Call real backend endpoint (failsafe dev mode implemented in backend)
            try {
                await fetch('http://localhost:3001/api/send-outbound', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: lead.email,
                        subject: template.subject.replace('[Location]', lead.location).replace('[Property Name]', `${lead.location} Estate`),
                        body: personalizedBody,
                        leadName: lead.name
                    })
                });
            } catch (err) {
                console.error("Outbound failed:", err);
            }

            setSentCount(i + 1);
            await new Promise(r => setTimeout(r, 600)); // Simulate delay for effect
        }

        setRunning(false);
        alert(`Successfully sent ${leads.length} notifications via ${campaignType} campaign!`);
    };

    return (
        <div className="outbound-container" style={{ background: '#f4f7f9', padding: '24px', minHeight: '100vh' }}>
            {/* Header section consistent with other pages */}
            <div className="flex-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>Outbound Automation</h1>
                    <p className="text-sm text-secondary">Smart multi-channel follow-ups and client alerts.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline btn-sm bg-white flex items-center gap-2">
                        <Calendar size={16} /> Schedule
                    </button>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>JD</div>
                </div>
            </div>

            {/* Campaign Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="crm-card p-5 bg-white shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <Mail size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">1,248</div>
                        <div className="text-xs text-secondary uppercase font-bold tracking-wider">EMAILS SENT THIS MONTH</div>
                    </div>
                </div>
                <div className="crm-card p-5 bg-white shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                        <Zap size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">84.2%</div>
                        <div className="text-xs text-secondary uppercase font-bold tracking-wider">OPEN RATE PERFORMANCE</div>
                    </div>
                </div>
                <div className="crm-card p-5 bg-white shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">24</div>
                        <div className="text-xs text-secondary uppercase font-bold tracking-wider">APPOINTMENTS BOOKED BY AI</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Controls & Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="crm-card bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-orange-500" /> Campaign Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-secondary mb-2 block uppercase">CAMPAIGN TYPE</label>
                                <div className="space-y-2">
                                    {Object.keys(CAMPAIGN_TEMPLATES).map(key => (
                                        <button
                                            key={key}
                                            onClick={() => setCampaignType(key)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${campaignType === key ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    {CAMPAIGN_TEMPLATES[key].icon}
                                                </div>
                                                <span className={`text-sm font-bold ${campaignType === key ? 'text-orange-700' : 'text-gray-700'}`}>
                                                    {key}
                                                </span>
                                            </div>
                                            {campaignType === key && <CheckCircle size={16} className="text-orange-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${running ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                onClick={handleRun}
                                disabled={running}
                            >
                                {running ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                                {running ? `Sending (${sentCount}/${leads.length})...` : 'Launch Automated Campaign'}
                            </button>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="crm-card bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex-between mb-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-secondary">Message Preview</h4>
                            <div className="flex gap-2">
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">PDF</span>
                                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">EMAIL</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
                            <div className="mb-3 border-b border-gray-200 pb-2">
                                <div className="text-[10px] text-secondary font-bold uppercase mb-1">Subject</div>
                                <div className="text-sm font-bold text-gray-800">{CAMPAIGN_TEMPLATES[campaignType].subject}</div>
                            </div>
                            <div className="text-[10px] text-secondary font-bold uppercase mb-1">Body</div>
                            <div className="text-xs text-gray-600 leading-relaxed italic" style={{ whiteSpace: 'pre-wrap' }}>
                                "{CAMPAIGN_TEMPLATES[campaignType].body.replace('[Name]', 'John Doe').replace('[Location]', 'Beverly Hills').replace('[Time]', '10:00 AM')}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Lead Queue */}
                <div className="lg:col-span-2">
                    <div className="crm-card bg-white shadow-sm border border-gray-100 overflow-hidden" style={{ borderRadius: '16px' }}>
                        <div className="p-6 border-b border-gray-100 flex-between">
                            <h3 className="text-lg font-bold">Automation Queue</h3>
                            <div className="text-xs font-bold text-secondary">
                                {leads.length} LEADS READY FOR PROCESSING
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-bold text-secondary tracking-widest uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Lead Detail</th>
                                        <th className="px-6 py-4">Last Contact</th>
                                        <th className="px-6 py-4">Stage</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10">
                                                <RefreshCw className="animate-spin mx-auto text-orange-500 mb-2" size={24} />
                                                <p className="text-secondary">Loading outbound queue...</p>
                                            </td>
                                        </tr>
                                    ) : leads.map((lead, i) => (
                                        <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{lead.name}</div>
                                                <div className="text-xs text-secondary">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                {lead.lastContact}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lead.stage === 'Hot' ? 'bg-red-50 text-red-600' :
                                                    lead.stage === 'New' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {lead.stage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sentCount > i ? (
                                                    <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                        <CheckCircle size={14} /> Sent
                                                    </div>
                                                ) : (
                                                    <div className={`flex items-center gap-1.5 font-bold text-xs ${running && sentCount === i ? 'text-orange-500' : 'text-secondary'}`}>
                                                        {running && sentCount === i ? <RefreshCw size={14} className="animate-spin" /> : <Clock size={14} />}
                                                        {running && sentCount === i ? 'Queueing...' : 'Pending'}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Outbound;
