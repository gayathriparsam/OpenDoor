import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const LeadContext = createContext();

export const useLeads = () => useContext(LeadContext);

const INITIAL_MOCK_LEADS = [
    {
        id: 'LEAD-8842',
        name: 'Sarah Jenkins',
        stage: 'New',
        score: 15,
        lastContacted: 'Just now',
        intent: 'Buyer',
        location: 'Downtown',
        budget: { min: 450000, max: 600000 },
        timeline: '3 months',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 012-3456',
        radarData: { budget: 45, intent: 60, timeline: 30 },
        checklist: {
            intent: true,
            location: true,
            budget: false,
            timeline: true,
            preApproval: false,
            motivation: false,
            email: false
        },
        appointment: {
            status: 'none',
            proposedSlots: [],
            confirmedSlot: null
        },
        nextAction: 'Calculate readiness score',
        reasoning: 'Initial contact made.'
    },
    {
        id: 'LEAD-99EM',
        name: 'Michael Chen',
        stage: 'Qualified',
        score: 95,
        lastContacted: '1 hour ago',
        intent: 'Buyer',
        location: 'Westlake',
        budget: { min: 700000, max: 800000 },
        timeline: 'Urgent (45 days)',
        email: 'm.chen@example.com',
        phone: '+1 (555) 987-6543',
        radarData: { budget: 90, intent: 95, timeline: 85 },
        checklist: {
            intent: true,
            location: true,
            budget: true,
            timeline: true,
            preApproval: true,
            motivation: true,
            email: true
        },
        appointment: {
            status: 'proposed',
            proposedSlots: ['Sat 10:00 AM', 'Sat 2:00 PM'],
            confirmedSlot: null
        },
        nextAction: 'Call back NOW (Urgent)',
        reasoning: 'Extracted high urgency signal "house sold". Pre-approval confirmed.'
    },
    { id: 'LEAD-33WF', name: 'Emma Wilson', stage: 'Follow-up', score: 60, lastContacted: '4 hours ago', radarData: { budget: 60, intent: 50, timeline: 70 }, checklist: {} },
    { id: 'LEAD-44JR', name: 'James Rodriguez', stage: 'Closed', score: 100, lastContacted: '1 day ago', radarData: { budget: 95, intent: 100, timeline: 90 }, checklist: {} },
];



const API_URL = 'http://localhost:3001/api/leads';

export const LeadProvider = ({ children }) => {
    const [leads, setLeads] = useState(() => {
        // Load from localStorage initially for instant UX
        const saved = localStorage.getItem('re_leads');
        return saved ? JSON.parse(saved) : INITIAL_MOCK_LEADS;
    });

    // Initial Fetch from Backend or Supabase
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // 1. Try Backend API first
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const mappedLeads = data.map(dbLead => ({
                            ...dbLead,
                            id: dbLead.id.toString(), // Ensure string
                            budget: { min: dbLead.budget_min || 0, max: dbLead.budget_max || 0 },
                            checklist: typeof dbLead.checklist === 'string' ? JSON.parse(dbLead.checklist) : (dbLead.checklist || {}),
                            appointment: typeof dbLead.appointment === 'string' ? JSON.parse(dbLead.appointment) : (dbLead.appointment || { status: 'none', proposedSlots: [], confirmedSlot: null }),
                            insights: typeof dbLead.insights === 'string' ? JSON.parse(dbLead.insights) : (dbLead.insights || { summary: '', objections: [], risks: [] })
                        }));
                        setLeads(mappedLeads);
                        localStorage.setItem('re_leads', JSON.stringify(mappedLeads));

                        // Fix: Auto-switch if we are on the default mock lead
                        if (selectedId === 'LEAD-8842' && mappedLeads.length > 0 && mappedLeads[0].id !== 'LEAD-8842') {
                            setSelectedId(mappedLeads[0].id);
                        }
                        return;
                    }
                }

                // 2. Fallback to Supabase
                if (!import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_SUPABASE')) {
                    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
                    if (data && !error && data.length > 0) {
                        const mappedLeads = data.map(dbLead => ({
                            ...dbLead,
                            id: dbLead.id.toString(),
                            budget: { min: dbLead.budget_min || 0, max: dbLead.budget_max || 0 },
                            checklist: dbLead.checklist || {},
                            appointment: dbLead.appointment || { status: 'none', proposedSlots: [], confirmedSlot: null },
                            insights: dbLead.insights || { summary: '', objections: [], risks: [] }
                        }));
                        setLeads(mappedLeads);
                    }
                }
            } catch (err) {
                console.error("Fetch leads failed:", err);
            }
        };

        fetchLeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync localStorage whenever leads change
    useEffect(() => {
        localStorage.setItem('re_leads', JSON.stringify(leads));
    }, [leads]);

    const updateLead = async (id, updates) => {
        // 1. Update local state
        setLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, ...updates } : lead
        ));

        // 2. Persist to Backend
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (err) {
            console.warn("Backend update failed, kept in local state/storage");
        }

        // 3. Persist to Supabase if config exists
        if (!import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_SUPABASE')) {
            const dbUpdates = { ...updates };
            if (updates.budget) {
                dbUpdates.budget_min = updates.budget.min;
                dbUpdates.budget_max = updates.budget.max;
                delete dbUpdates.budget;
            }
            await supabase.from('leads').update(dbUpdates).eq('id', id);
        }
    };

    const addLead = async (newLeadData) => {
        const tempId = `TEMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const newLead = {
            id: tempId,
            ...newLeadData,
            stage: newLeadData.stage || 'New',
            score: newLeadData.score || 10,
            lastContacted: 'Just now',
            checklist: newLeadData.checklist || {},
            appointment: newLeadData.appointment || { status: 'none', proposedSlots: [], confirmedSlot: null },
            insights: { summary: 'Manually created lead.', objections: [], risks: [] },
            budget: newLeadData.budget || { min: 0, max: 0 }
        };

        // 1. Optimistic Add
        setLeads(prev => [newLead, ...prev]);

        // 2. Persist to Backend
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLead)
            });
            if (response.ok) {
                const data = await response.json();
                setLeads(prev => prev.map(l => l.id === tempId ? { ...l, id: data.id.toString() } : l));
            }
        } catch (err) {
            console.warn("Backend add failed, kept in local state/storage");
        }

        // 3. Persist to Supabase if config exists
        if (!import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_SUPABASE')) {
            const dbPayload = {
                name: newLead.name,
                email: newLead.email,
                phone: newLead.phone,
                stage: newLead.stage,
                score: newLead.score,
                intent: newLead.intent,
                location: newLead.location,
                timeline: newLead.timeline,
                budget_min: newLead.budget.min,
                budget_max: newLead.budget.max,
                checklist: newLead.checklist,
                appointment: newLead.appointment,
                insights: newLead.insights,
                reasoning: newLead.reasoning
            };

            const { data, error } = await supabase.from('leads').insert(dbPayload).select().single();

            if (data && !error) {
                setLeads(prev => prev.map(l => l.id === tempId ? { ...l, id: data.id } : l));
            }
        }
        return newLead;
    };

    const [selectedId, setSelectedId] = useState('LEAD-8842');

    // Derived State
    const activeLead = leads.find(l => l.id === selectedId) || (leads.length > 0 ? leads[0] : null);

    const value = {
        leads,
        updateLead,
        addLead,
        selectedId,
        setSelectedId,
        activeLead
    };

    return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};
