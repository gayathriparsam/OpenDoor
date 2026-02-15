import React from 'react';
import CallPanel from '../components/simulator/CallPanel';
import CRMSnapshot from '../components/simulator/CRMSnapshot';
import { CallProvider } from '../context/CallContext';
import '../styles/simulator.css';

import { useLeads } from '../context/LeadContext';

const CallSimulator = () => {
    const { leads, activeLead, setSelectedId } = useLeads();

    return (
        <CallProvider>
            <div className="flex-between p-4 bg-white border-b">
                <h1 className="text-xl font-bold text-gray-800">Interactive Call Simulator</h1>
                <div className="flex-center gap-2">
                    <span className="text-sm font-medium text-secondary">Active Lead:</span>
                    <select
                        className="p-2 border rounded text-sm bg-gray-50 min-w-[200px]"
                        value={activeLead?.id || ''}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        {leads.map(lead => (
                            <option key={lead.id} value={lead.id}>
                                {lead.name} ({lead.stage})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="simulator-layout" style={{ height: 'calc(100vh - 130px)' }}>
                <div className="left-panel">
                    <CallPanel />
                </div>
                <div className="right-panel">
                    <CRMSnapshot />
                </div>
            </div>
        </CallProvider>
    );
};

export default CallSimulator;
