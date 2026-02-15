import Groq from "groq-sdk";
import { GROQ_API_KEY, SYSTEM_PROMPT } from "../config/groqConfig";

const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

export const getGroqResponse = async (userText, chatHistory = [], leadContext = {}) => {
    try {
        let systemPrompt = SYSTEM_PROMPT;

        // Inject Dynamic Context
        if (leadContext) {
            systemPrompt = systemPrompt
                .replace('[LEAD_NAME]', leadContext.name || 'Valued Client')
                .replace('[LEAD_STAGE]', leadContext.stage || 'New')
                .replace('[LEAD_INTEREST]', leadContext.interest || `Property in ${leadContext.location || 'your area'}`);
        }

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: userText }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content;

        try {
            return JSON.parse(responseContent);
        } catch (e) {
            console.error("Failed to parse Groq JSON:", e);
            // Fallback if model returns raw text despite instructions
            return {
                text: responseContent || "I'm having trouble understanding. Could you repeat that?",
                crm_update: {}
            };
        }

    } catch (error) {
        console.error("Groq API Error:", error);
        return {
            text: "I'm sorry, I'm having trouble connecting to the AI. Can you say that again?",
            crm_update: {}
        };
    }
};
