import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import LeadList from '../components/dashboard/LeadList';
import LeadDetail from '../components/dashboard/LeadDetail';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { leads, activeLead, setSelectedId } = useLeads();

    return (
        <div className="dashboard-layout">
            <LeadList
                selectedId={activeLead?.id}
                onSelect={(lead) => setSelectedId(lead.id)}
            />
            <LeadDetail lead={activeLead} />
        </div>
    );
};

export default Dashboard;
