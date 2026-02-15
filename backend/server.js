require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const nodemailer = require('nodemailer');

// In-memory store for verification codes
const verificationCodes = {};

console.log('--- Mailer Config Check ---');
console.log('Checking file at:', path.join(__dirname, '.env'));
const emailVal = process.env.EMAIL_USER || '';
const passVal = process.env.EMAIL_PASS || '';

const isUserPlaceholder = !emailVal || emailVal.includes('your-email') || emailVal.includes('gayathri.parsam09@gmail.com');
const isPassPlaceholder = !passVal || passVal.includes('your-password') || passVal.includes('REPLACE_WITH');

console.log('EMAIL_USER:', isUserPlaceholder ? 'PLACEHOLDER DETECTED ❌' : 'Configured ✅');
console.log('EMAIL_PASS:', isPassPlaceholder ? 'PLACEHOLDER DETECTED ❌' : 'Configured ✅');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('Mail transporter verify error:', error);
    } else {
        console.log('Server is ready to take our messages ✅');
    }
});

// POST /api/send-code - Send verification code via email
app.post('/api/send-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    console.log(`\n🔑 VERIFICATION CODE FOR ${email}: ${code}\n`);

    const mailOptions = {
        from: `"OpenDoor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - OpenDoor',
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Verify your email</h2>
                <p>Use the code below to complete your signup:</p>
                <h1 style="color: #2563eb; letter-spacing: 5px;">${code}</h1>
                <p>This code will expire in 10 minutes.</p>
               </div>`
    };

    try {
        const isPlaceholder = !process.env.EMAIL_USER ||
            process.env.EMAIL_USER.includes('your-email') ||
            !process.env.EMAIL_PASS ||
            process.env.EMAIL_PASS.includes('your-app-password');

        if (isPlaceholder) {
            console.warn(`[CONFIG ERROR] Placeholder credentials detected for ${email}`);
            return res.status(500).json({
                success: false,
                message: 'Email configuration missing. Please update backend/.env with your real Gmail and App Password.'
            });
        }

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email} (Code: ${code})`);
        res.json({ success: true, message: 'Verification code sent to email' });

    } catch (error) {
        console.error('CRITICAL Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Email service error. Check if your Gmail "App Password" is correct.',
            error: error.message
        });
    }
});

// POST /api/send-outbound - Send campaign emails to leads
app.post('/api/send-outbound', async (req, res) => {
    const { to, subject, body, leadName } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ success: false, message: 'Recipient, subject, and body are required' });
    }

    const mailOptions = {
        from: `"OpenDoor" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: body,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="background: #1e293b; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h2 style="color: #ff9800; margin: 0;">OpenDoor</h2>
                </div>
                <div style="padding: 30px; line-height: 1.6; color: #334155;">
                    <p>Hi ${leadName || 'there'},</p>
                    <div style="font-size: 16px;">
                        ${body.replace(/\n/g, '<br>')}
                    </div>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px;">
                        <strong>Next Steps:</strong><br>
                        If you have any questions, just reply to this email!
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee;">
                    © 2026 OpenDoor Real Estate • 123 Business Way, Suite 100
                </div>
               </div>`
    };

    try {
        const isPlaceholder = !process.env.EMAIL_USER ||
            process.env.EMAIL_USER.includes('your-email') ||
            !process.env.EMAIL_PASS ||
            process.env.EMAIL_PASS.includes('your-app-password') ||
            process.env.EMAIL_PASS.includes('REPLACE_WITH');

        if (isPlaceholder) {
            console.warn(`[CONFIG ERROR] Outbound blocked: Placeholder credentials.`);
            return res.status(500).json({
                success: false,
                message: 'Outbound email failed: Email configuration missing in backend/.env'
            });
        }

        await transporter.sendMail(mailOptions);
        console.log(`Outbound email sent successfully to ${to}`);
        res.json({ success: true, message: `Email sent to ${to}` });
    } catch (error) {
        console.error('Outbound Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send outbound email. Check your Gmail App Password.',
            error: error.message
        });
    }
});

// POST /api/verify-code - Verify the code
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    if (verificationCodes[email] === code) {
        delete verificationCodes[email]; // Clear code after successful use
        res.json({ success: true, message: 'Email verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }
});

// Routes

// GET /api/leads - Fetch all leads
app.get('/api/leads', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST /api/leads - Create a new lead
app.post('/api/leads', async (req, res) => {
    const { name, email, phone, stage, score, intent, location, budget, timeline, checklist, appointment, insights } = req.body;

    // Map JSON "budget" object to separate columns for SQL if needed, or store as JSON
    const minBudget = budget?.min || 0;
    const maxBudget = budget?.max || 0;

    try {
        const result = await db.query(
            `INSERT INTO leads (name, email, phone, stage, score, intent, location, budget_min, budget_max, timeline, checklist, appointment, insights, reasoning)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [name, email, phone, stage, score, intent, location, minBudget, maxBudget, timeline, checklist, appointment, insights, req.body.reasoning]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// PUT /api/leads/:id - Update a lead
app.put('/api/leads/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Dynamically build SQL update query
    // NOTE: This is a simplified version. For production, use a query builder like Knex.js or an ORM

    // Handling budget specifically if passed as object
    if (updates.budget) {
        updates.budget_min = updates.budget.min;
        updates.budget_max = updates.budget.max;
        delete updates.budget;
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return res.status(400).send('No fields to update');

    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    try {
        const result = await db.query(
            `UPDATE leads SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a catch-all error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
