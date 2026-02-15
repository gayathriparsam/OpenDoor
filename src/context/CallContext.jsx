import { getGroqResponse } from '../utils/groqService';
import { useLeads } from './LeadContext';
import React, { createContext, useContext, useState } from 'react';

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
    const { leads, updateLead, activeLead } = useLeads();

    // Local UI state
    const [isPlaying, setIsPlaying] = useState(false);
    const [messages, setMessages] = useState([]);
    const [scriptIndex, setScriptIndex] = useState(0);
    const [mode, setMode] = useState('Call_Sim'); // Call_Sim | Text
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(null);
    const [currentAudioClip, setCurrentAudioClip] = useState(null);
    const [sentiment, setSentiment] = useState(50); // 0 (Cold) to 100 (Hot)
    // Initialize with INTRO replies
    const [quickReplies, setQuickReplies] = useState(["I'm looking to buy", "Just browsing", "Selling my home"]);

    // Use active lead from context
    const [lead, setLeadState] = useState(activeLead);

    // Sync local lead state when activeLead changes (e.g. navigation)
    React.useEffect(() => {
        if (activeLead) {
            setLeadState(activeLead);

            // Only Reset simulation state when switching to a DIFFERENT lead ID
            if (activeLead.id !== lead?.id) {
                setMessages([]);
                setIsPlaying(false);
                setScriptIndex(0);
            }
        }
    }, [activeLead]);

    // Keep local lead in sync with global context or vice versa
    const setLead = (updater) => {
        const next = typeof updater === 'function' ? updater(lead) : updater;
        setLeadState(next);
        updateLead(next.id, next);
    };

    // Browser TTS Helper
    // Browser TTS Helper
    // Browser TTS Helper
    const [voices, setVoices] = useState([]);

    React.useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            // Use pre-loaded voices
            const preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
                voices.find(v => v.name.includes('Microsoft Zira')) ||
                voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            // Speak immediately
            window.speechSynthesis.speak(utterance);
        }
    };

    const generateAIResponse = async (text) => {
        setIsProcessing(true);
        setProcessingStep('Thinking (Llama 3)...');

        // 2. Call Llama 3 via Groq with Dynamic Context
        const aiResponse = await getGroqResponse(
            text,
            messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'agent' ? 'assistant' : 'user', content: m.text })),
            {
                name: lead.name,
                stage: lead.stage,
                location: lead.location,
                interest: `${lead.intent} looking for property in ${lead.location}`
            }
        );

        setIsProcessing(false);
        setProcessingStep(null);

        const responseText = aiResponse.text || "I didn't catch that.";
        const crmUpdate = aiResponse.crm_update || {};

        // 3. AI Response
        const agentMsg = {
            role: 'agent',
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'AI (Llama 3)'
        };
        setMessages(prev => [...prev, agentMsg]);

        // TRIGGER AUDIO
        speakText(responseText);

        // 4. Update CRM State (Dynamic)
        if (crmUpdate && Object.keys(crmUpdate).length > 0) {
            setLead(prev => ({
                ...prev,
                checklist: { ...prev.checklist, ...(crmUpdate.checklist || {}) },
                budget: crmUpdate.budget ? { ...prev.budget, ...crmUpdate.budget } : prev.budget,
                location: crmUpdate.location || prev.location,
                timeline: crmUpdate.timeline || prev.timeline,
                intent: crmUpdate.intent || prev.intent,
                email: crmUpdate.email || prev.email,
                financing: crmUpdate.financing ? { ...prev.financing, ...crmUpdate.financing } : prev.financing,
                appointment: crmUpdate.appointment ? {
                    status: crmUpdate.appointment.status,
                    confirmedSlot: crmUpdate.appointment.time || prev.appointment.confirmedSlot,
                    proposedSlots: crmUpdate.appointment.status === 'proposed' ? [crmUpdate.appointment.time] : prev.appointment.proposedSlots
                } : prev.appointment, /* Updated to merge properly */
                reasoning: `Llama extracted: ${JSON.stringify(crmUpdate)}`
            }));
        }
    };

    const addUserMessage = async (text) => {
        const userMsg = {
            role: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'User'
        };
        setMessages(prev => [...prev, userMsg]);

        // Trigger AI response
        await generateAIResponse(text);
    };

    const processUserVoice = (text) => {
        addUserMessage(text);
    };

    const processVoicemail = async () => {
        setIsProcessing(true);
        setProcessingStep('Analyzing voicemail...');

        // Simulate voicemail processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const voicemailText = `Hi, this is ${lead.name || 'the lead'}. I saw your listing and I'm interested. Please call me back.`;
        const userMsg = {
            role: 'user',
            text: voicemailText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'Voicemail'
        };
        setMessages(prev => [...prev, userMsg]);

        await generateAIResponse(voicemailText);

        setIsProcessing(false);
        setProcessingStep(null);
    };

    // ... (keep processUserVoice, addUserMessage, processVoicemail same)

    // Demo Scenarios with Dynamic Lead Name
    const firstName = lead?.name?.split(' ')[0] || 'there';

    const scenarios = {
        'Buyer': [
            {
                role: 'agent',
                text: `Hi ${firstName}, this is Alex from OpenDoor. I saw you were looking at properties in ${lead.location || 'the area'}. Is this a good time?`,
                type: "Intro",
                update: { stage: 'Qualified', score: 25, reasoning: "Opening script executed." }
            },
            {
                role: 'user',
                text: "Yeah, I have a minute. I'm just looking at photos though.",
                type: "Response",
                update: { score: 30, reasoning: "User is hesitant but engaged." }
            },
            {
                role: 'agent',
                text: "Totally understand! Just curious, are you looking to buy something in the next few months, or just keeping an eye on the market?",
                type: "Qualification",
                update: {
                    stage: 'Qualified',
                    score: 45,
                    checklist: { motivation: true },
                    nextAction: 'Determine budget',
                    reasoning: "Probing for timeline/motivation."
                }
            },
            {
                role: 'user',
                text: "Well, my lease ends in 3 months, so I'd like to find something before then if the price is right.",
                type: "Response",
                update: {
                    score: 75,
                    timeline: '3 months',
                    checklist: { budget: true },
                    nextAction: 'Propose appointments',
                    reasoning: "Timeline confirmed."
                }
            },
            {
                role: 'agent',
                text: "That makes sense. We actually have a few units opening up for viewing this weekend. Would Saturday morning work for a quick tour?",
                type: "Scheduling",
                update: {
                    score: 85,
                    appointment: { status: 'proposed', proposedSlots: ['Sat 10:00 AM', 'Sat 2:00 PM'] },
                    nextAction: 'Confirm slot',
                    reasoning: "Proposing specific slots."
                }
            },
            {
                role: 'user',
                text: "Saturday morning at 10 works.",
                type: "Response",
                update: {
                    score: 95,
                    appointment: { status: 'confirmed', confirmedSlot: 'Sat 10:00 AM' },
                    nextAction: 'Send confirmation email',
                    insights: { summary: 'High intent buyer. Confirmed for Sat.' },
                    reasoning: "Appointment confirmed."
                }
            }
        ],
        'Just Browsing': [
            { role: 'agent', text: `Hi ${firstName}, this is Alex. Is this a good time?`, type: "Intro", update: { stage: 'New', score: 20 } },
            { role: 'user', text: "No, I'm just looking at photos. Not interested.", type: "Objection", update: { stage: 'Nurture', score: 10, reasoning: "Hard objection detected." } },
            { role: 'agent', text: "No problem at all. I'll send you an email with similar listings just in case. Have a great day!", type: "Closing", update: { nextAction: 'Send Nurture Email', reasoning: "Respecting objection." } }
        ],
        'Invalid JSON': [
            { role: 'agent', text: "System check...", type: "System", update: { reasoning: "Injecting malformed JSON..." } },
            { role: 'user', text: "Here is my budget: five hundred thousand.", type: "Response", update: { score: 50, reasoning: "LLM Error: Failed to parse 'five hundred thousand'..." } },
            { role: 'agent', text: "Got it, so around $500,000. I can work with that.", type: "Recovery", update: { reasoning: "Error recovered." } }
        ]
    };

    const [activeScenario, setActiveScenario] = useState('Buyer');

    const startCall = (scenarioName = 'Buyer') => {
        const selectedScenario = scenarios[scenarioName] || scenarios['Buyer'];
        setActiveScenario(scenarioName);
        setMessages([]);
        setScriptIndex(0);
        setIsPlaying(true);

        // Play first line of new scenario
        const firstLine = selectedScenario[0];
        if (firstLine) {
            setMessages([{ ...firstLine, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            if (firstLine.update) {
                updateLeadState(firstLine.update);
            }
            setScriptIndex(1);
        }
    };

    const playNextLine = () => {
        const currentScript = scenarios[activeScenario];
        if (scriptIndex >= currentScript.length) return;

        const line = currentScript[scriptIndex];
        setMessages(prev => [...prev, { ...line, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

        if (line.update) {
            updateLeadState(line.update);
        }

        setScriptIndex(prev => prev + 1);
    };

    const updateLeadState = (update) => {
        setLead(prev => ({
            ...prev,
            ...update,
            checklist: update.checklist ? { ...prev.checklist, ...update.checklist } : prev.checklist,
            appointment: update.appointment ? { ...prev.appointment, ...update.appointment } : prev.appointment,
            insights: update.insights ? { ...prev.insights, ...update.insights } : prev.insights
        }));
    };

    const resetSimulation = () => {
        window.speechSynthesis.cancel();
        setMessages([]);
        setScriptIndex(0);
        setIsPlaying(false);
        setLead(prev => ({
            ...prev, stage: 'New', score: 15, appointment: { status: 'none', proposedSlots: [], confirmedSlot: null }, nextAction: 'Start Call'
        }));
    };

    const value = {
        isPlaying,
        messages,
        lead,
        startCall,
        playNextLine,
        resetSimulation,
        mode,
        setMode,
        addUserMessage,
        processVoicemail,
        isProcessing,
        processingStep,
        processUserVoice,
        currentAudioClip,
        quickReplies,
        sentiment
    };

    return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
