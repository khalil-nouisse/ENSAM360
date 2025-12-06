import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import axios from 'axios';

export default function Chatbot({ location }) {

    // Helper to get or create a session ID
    const getSessionId = () => {
        let sessionId = localStorage.getItem('chat_session_id');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat_session_id', sessionId);
        }
        return sessionId;
    };

    const chatbotRes = async (userMessage) => {
        // Always try to get the latest location from localStorage first
        const savedBuilding = localStorage.getItem('selectedBuilding');
        const currentLocation = savedBuilding ? JSON.parse(savedBuilding) : location;
        const userId = getSessionId();

        console.log("chatbotRes called. Location:", currentLocation, "User:", userId);

        if (!currentLocation) {
            console.log("problem: location is missing")
            return
        }

        if (currentLocation) {
            const res = await axios.post(import.meta.env.VITE_BACKEND_SERVER + "/api/chatbot", {
                message: userMessage,
                locationID: currentLocation.id,
                userId: userId
            });
            console.log(res.data);
            return res.data
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

     const formatMessage = (text) => {
        if (!text) return "";
        // Replace "sentence. - item" with "sentence.\n- item"
        // Also handles cases where it might just be "- item" without punctuation immediately before, but usually it follows a sentence.
        // We look for a period/colon followed by space and a hyphen.
        return text.replace(/([.:])\s+-\s+/g, "$1\n- ");
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Simulate bot response
        // setTimeout(() => {
        //     const botResponse = {
        //         id: Date.now() + 1,
        //         text: "I'm a demo bot. I received your message: " + newUserMessage.text,
        //         sender: 'bot'
        //     };
        //     setMessages(prev => [...prev, botResponse]);
        // }, 1000);

        // real response
        setIsLoading(true);
        try {
            const botResponse = await chatbotRes(newUserMessage.text)
            const newBotMessage = {
                id: Date.now() + 1,
                text: formatMessage(botResponse.message),
                sender: 'bot'
            };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            console.error("Failed to get response", error);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Panel */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out origin-bottom-right mb-4 pointer-events-auto",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-10 pointer-events-none"
                )}
            >
                <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-white/40 backdrop-blur-xl bg-white/60 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/30 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-gray-800">AI Assistant</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-black/5 hover:text-destructive transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={16} />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full",
                                    msg.sender === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm",
                                        msg.sender === 'user'
                                            ? "bg-primary/90 text-primary-foreground rounded-br-none"
                                            : "bg-white/70 border border-white/40 text-gray-800 rounded-bl-none"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-full justify-start">
                                <div className="bg-white/70 border border-white/40 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm backdrop-blur-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/20 bg-white/30 backdrop-blur-md">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-white/40 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-gray-500/70 text-gray-800 min-w-0"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim()}
                                className={cn(
                                    "h-8 w-8 rounded-full shrink-0 transition-all duration-200",
                                    inputValue.trim()
                                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                                        : "bg-black/5 text-gray-400 hover:bg-black/10"
                                )}
                            >
                                <Send size={14} className={cn(inputValue.trim() && "ml-0.5")} />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto",
                    isOpen
                        ? "bg-destructive hover:bg-destructive/90 rotate-90"
                        : "bg-primary hover:bg-primary/90 rotate-0"
                )}
            >
                {isOpen ? (
                    <X size={24} className="text-destructive-foreground" />
                ) : (
                    <MessageCircle size={24} className="text-primary-foreground" />
                )}
            </Button>
        </div>
    );
}
