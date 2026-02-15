export const VOICE_RESPONSES = {
    INTRO: {
        text: "Hi this is Alex! Are you looking for a home or just browsing?",
        file: "intro.mp3",
        nextStates: ['BUYER', 'BROWSING'],
        quickReplies: ["I'm looking to buy", "Just browsing", "Selling my home"]
    },
    ASK_TYPE: {
        text: "Wonderful! What kind of property are you interested in? Any specific layout?",
        file: "ask_type.mp3",
        update: { checklist: { intent: true } },
        quickReplies: ["2BHK Apartment", "3BHK House", "Villa", "Plot / Land", "Farmhouse"]
    },
    ASK_BUDGET: {
        text: "That sounds great! Do you have a price range in mind for this investment?",
        file: "ask_budget.mp3",
        update: { checklist: { motivation: true } },
        quickReplies: ["$300k - $500k", "$500k - $800k", "$800k - $1.2M", "$1.5M+"]
    },
    ASK_LOCATION: {
        text: "Excellent choice. Which area or neighborhood do you prefer?",
        file: "ask_location.mp3",
        update: { checklist: { budget: true } },
        quickReplies: ["Downtown", "Suburbs", "North City", "West Lake", "Near Schools"]
    },
    ASK_TIMELINE: {
        text: "Got it. How soon are you looking to move?",
        file: "ask_timeline.mp3",
        update: { checklist: { location: true } },
        quickReplies: ["Immediately (Urgent)", "In 1-3 months", "3-6 months", "Just planning"]
    },
    CLOSE_APPT: {
        text: "I have a few perfect matches. Can you tour this Saturday at 10 AM?",
        file: "close_appt.mp3",
        update: { checklist: { timeline: true }, nextAction: 'Confirm Appt' },
        quickReplies: ["Yes, Saturday 10 AM works", "How about Sunday?", "Weekday evening?", "Call me later"]
    },
    FALLBACK: {
        text: "Could you clarify that for me?",
        file: "fallback.mp3",
        quickReplies: ["I said my budget is $500k", "Looking for 3BHK", "West Lake area"]
    }
};

export const MOCK_INTENT_CLASSIFIER = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('hi') || lower.includes('hello') || lower.includes('start')) return 'INTRO';

    // Specific Entity Checks for Type
    if (lower.includes('bhk') || lower.includes('apartment') || lower.includes('villa') || lower.includes('plot') || lower.includes('farm') || lower.includes('house') || lower.includes('land')) return 'ASK_BUDGET'; // Moved flow: Type -> Budget

    // Specific checks for Buy/Looking (Transition to Type)
    if (lower.includes('buy') || lower.includes('looking') || lower.includes('investment')) return 'ASK_TYPE';

    if (lower.includes('thousand') || lower.includes('$') || lower.includes('budget') || lower.includes('price')) return 'ASK_LOCATION';

    if (lower.includes('downtown') || lower.includes('suburb') || lower.includes('area') || lower.includes('city') || lower.includes('lake')) return 'ASK_TIMELINE';

    if (lower.includes('month') || lower.includes('soon') || lower.includes('week') || lower.includes('urgent')) return 'CLOSE_APPT';

    return 'FALLBACK';
};
