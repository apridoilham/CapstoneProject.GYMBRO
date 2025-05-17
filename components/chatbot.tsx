"use client"

import { useState, useEffect, useRef } from 'react';
import { MessageSquareText, X, Send, BotIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  type: 'user' | 'bot';
  content: string;
  id: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: "Yo! I'm your GYM BRO AI Assistant. Got questions about your plan, nutrition, or just need a pep talk? Hit me up!", id: crypto.randomUUID() }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoadingResponse(true);

    const newUserMessage: Message = { type: 'user', content: input, id: crypto.randomUUID() };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input;
    setInput('');

    await new Promise(resolve => setTimeout(resolve, 1200));

    const botResponse: Message = {
      type: 'bot',
      content: `Got it, Bro: "${currentInput}". Right now, I'm just a demo. In a real GYM BRO setup, I'd analyze that and give you some killer AI insights! Keep pushing!`,
      id: crypto.randomUUID()
    };
    setMessages(prev => [...prev, botResponse]);
    setIsLoadingResponse(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-xl hover:bg-primary/80 transition-all duration-300 z-50 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Open GYM BRO Assistant"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <MessageSquareText size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[370px] max-h-[70vh] flex flex-col bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl overflow-hidden z-[60]"
          >
            <header className="bg-zinc-800 p-3.5 flex justify-between items-center border-b border-zinc-700">
              <div className="flex items-center">
                <BotIcon size={20} className="mr-2.5 text-primary" />
                <h3 id="chatbot-title" className="text-white font-semibold text-md">GYM BRO AI</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-zinc-700/80 focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/30" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full",
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "max-w-[85%] p-2.5 md:p-3 rounded-lg text-sm leading-relaxed shadow-md",
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-zinc-800 text-gray-200 rounded-bl-none'
                    )}
                  >
                    {message.content}
                  </motion.div>
                </div>
              ))}
              {isLoadingResponse && (
                <div className="flex justify-start">
                   <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-md bg-zinc-800 text-gray-200 rounded-bl-none"
                  >
                    <span className="animate-pulse">GYM BRO AI is typing...</span>
                  </motion.div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-3 border-t border-zinc-700 bg-zinc-800/90">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your GYM BRO AI..."
                  className="flex-1 bg-zinc-700 border-zinc-600 text-white placeholder-gray-400 focus:border-primary/80 h-10"
                  aria-label="Chat input"
                />
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                  aria-label="Send message"
                  disabled={!input.trim() || isLoadingResponse}
                >
                  <Send size={18} />
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}