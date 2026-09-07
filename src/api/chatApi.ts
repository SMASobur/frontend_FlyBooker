const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const chatApi = {
    sendMessage: async (sessionId: string, message: string): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/assistant/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from AI assistant.');
        }

        const data = await response.json();
        return data.response;
    },
};