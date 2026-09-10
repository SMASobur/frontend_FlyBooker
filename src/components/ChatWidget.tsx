import { useState, useEffect, useRef } from 'react';
import { chatApi } from '../api/chatApi';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Generate a random session ID for the user (or get from localStorage)
const getSessionId = () => {
    let id = localStorage.getItem('chat_session_id');
    if (!id) {
        id = 'user-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('chat_session_id', id);
    }
    return id;
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm Wavi, How can I help you with your flight booking today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const sessionId = getSessionId();
            const aiResponse = await chatApi.sendMessage(sessionId, userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
                >
                    <MessageCircle size={24} />
                    <span className="hidden group-hover:block absolute right-16 whitespace-nowrap bg-slate-800 text-white text-sm px-2 py-1 rounded-md">
            Chat with Wavi
          </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-cyan-500 p-1.5 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold leading-none">Wavi</h3>
                                <p className="text-xs text-slate-300">Always here to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="bg-cyan-500 p-1.5 rounded-full h-fit">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-slate-800 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                }`}>
                                    {/* Use ReactMarkdown for Assistant messages, plain text for User messages */}
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm max-w-none flex flex-col">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    // Custom styling for markdown elements inside the chat bubble
                                                    p: ({node, ...props}) => <p style={{ margin: 0 }} {...props} />,
                                                    ul: ({node, ...props}) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }} {...props} />,
                                                    li: ({node, ...props}) => <li style={{ marginTop: '0.25rem' }} {...props} />,
                                                    strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="bg-slate-300 p-1.5 rounded-full h-fit">
                                        <User size={16} className="text-slate-700" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="bg-cyan-500 p-1.5 rounded-full">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none">
                                    <Loader2 size={16} className="animate-spin text-slate-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about flights..."
                            className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-cyan-500 text-white p-2.5 rounded-full hover:bg-cyan-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;