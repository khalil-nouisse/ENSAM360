import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleSendMessage = (e) => {
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
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: "I'm a demo bot. I received your message: " + newUserMessage.text,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
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
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-white" />
                )}
            </Button>
        </div>
    );
}
