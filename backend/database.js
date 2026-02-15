const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const DB_FILE = path.resolve(__dirname, 'leads.json');

// Helper to initialize local file if it doesn't exist
const initFile = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            leads: [
                {
                    id: 1,
                    name: 'Sarah Jenkins',
                    stage: 'New',
                    score: 15,
                    created_at: new Date().toISOString(),
                    last_contacted: new Date().toISOString(),
                    intent: 'Buyer',
                    location: 'Downtown',
                    budget_min: 450000,
                    budget_max: 600000,
                    timeline: '3 months',
                    checklist: '{}',
                    appointment: '{}',
                    insights: '{}',
                    reasoning: 'Initial contact made.'
                }
            ],
            nextId: 2
        }, null, 2));
    }
};

let db;

// Strategy: Use PostgreSQL if DATABASE_URL is valid, otherwise use JSON file
const usePostgres = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password');

if (usePostgres) {
    console.log('Using PostgreSQL database');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });
    db = {
        query: (text, params) => pool.query(text, params),
        type: 'postgres'
    };
} else {
    console.log('Using local JSON File database (leads.json)');
    initFile();

    db = {
        type: 'file',
        query: async (text, params = []) => {
            const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            const textUpper = text.trim().toUpperCase();

            // Simplified Mock SQL Parser for JSON
            if (textUpper.startsWith('SELECT')) {
                if (textUpper.includes('WHERE ID =')) {
                    const id = parseInt(params[0]);
                    const lead = data.leads.find(l => l.id == id);
                    return { rows: lead ? [lead] : [] };
                }
                // Default: Return all sorted
                return { rows: [...data.leads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
            }

            if (textUpper.startsWith('INSERT')) {
                const newLead = {
                    id: data.nextId++,
                    created_at: new Date().toISOString(),
                    name: params[0],
                    email: params[1],
                    phone: params[2],
                    stage: params[3],
                    score: params[4],
                    intent: params[5],
                    location: params[6],
                    budget_min: params[7],
                    budget_max: params[8],
                    timeline: params[9],
                    checklist: params[10],
                    appointment: params[11],
                    insights: params[12],
                    reasoning: params[13]
                };
                data.leads.push(newLead);
                fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
                return { rows: [newLead], lastID: newLead.id };
            }

            if (textUpper.startsWith('UPDATE')) {
                // Simplified: params are [value1, value2..., id]
                const id = parseInt(params[params.length - 1]);
                const leadIndex = data.leads.findIndex(l => l.id == id);
                if (leadIndex !== -1) {
                    // This is a bit hacky but works for the current server.js implementation
                    // which dynamically builds the SET clause.
                    // Instead of full parsing, we'll just update fields by position if possible
                    // or better: just assume the server sends the whole object (it doesn't yet).

                    // Actually, let's just refresh the whole lead list for now if it's a demo
                    // OR handle the fields specifically.

                    // The server builds: UPDATE leads SET field1 = $1, field2 = $2 WHERE id = $3
                    const fieldsMatch = text.match(/SET (.*?) WHERE/i);
                    if (fieldsMatch) {
                        const setPart = fieldsMatch[1].split(',');
                        setPart.forEach((part, i) => {
                            const fieldName = part.split('=')[0].trim();
                            data.leads[leadIndex][fieldName] = params[i];
                        });
                    }

                    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
                    return { rows: [data.leads[leadIndex]] };
                }
            }
            return { rows: [] };
        }
    };
}

module.exports = db;
