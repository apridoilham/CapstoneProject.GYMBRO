"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquareText,
  X,
  Send,
  BotIcon,
  Image as ImageIcon,
  File as FileIcon,
  Paperclip,
  Plus,
  Loader2,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Message {
  type: "user" | "bot";
  content: string;
  id: string;
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
  }[];
}

interface FileAttachment {
  type: "image" | "file";
  url: string;
  name: string;
}

// Add translations
const translations = {
  en: {
    welcome:
      "Yo! I'm your GYM BRO AI Assistant. Got questions about your plan, nutrition, or just need a pep talk? Hit me up!",
    title: "GYM BRO AI",
    subtitle: "Your Personal Fitness Assistant",
    placeholder: "Ask your GYM BRO AI...",
    addImage: "Add Image",
    addDocument: "Add Document",
    loading: "GYM BRO is crafting a response...",
    error:
      "Oops! Something went wrong, bro. Check your connection and try again!",
    processingError: "Sorry bro, I had trouble processing that. Try again!",
  },
  id: {
    welcome:
      "Yo! Saya GYM BRO AI Assistant kamu. Punya pertanyaan tentang program latihan, nutrisi, atau butuh motivasi? Tanya aja!",
    title: "GYM BRO AI",
    subtitle: "Asisten Fitness Pribadi Kamu",
    placeholder: "Tanya ke GYM BRO AI...",
    addImage: "Tambah Gambar",
    addDocument: "Tambah Dokumen",
    loading: "GYM BRO sedang menyiapkan jawaban...",
    error: "Ups! Terjadi kesalahan. Periksa koneksi kamu dan coba lagi!",
    processingError:
      "Maaf bro, ada masalah dalam memproses permintaan. Coba lagi ya!",
  },
  // Add more languages as needed
};

export default function Chatbot() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "id">("id"); // Default to Indonesian
  const t = translations[language];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: t.welcome,
      id: crypto.randomUUID(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setIsAttachmentMenuOpen(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add language toggle
  const toggleLanguage = () => {
    const newLang = language === "en" ? "id" : "en";
    setLanguage(newLang);
    // Update welcome message
    setMessages((prev) => [
      {
        type: "bot",
        content: translations[newLang].welcome,
        id: prev[0].id,
      },
      ...prev.slice(1),
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    setIsLoadingResponse(true);
    setIsUploading(true);

    try {
      // Simulasi upload file (ganti dengan implementasi upload file yang sebenarnya)
      const uploadedAttachments: FileAttachment[] = await Promise.all(
        selectedFiles.map(async (file) => ({
          type: file.type.startsWith("image/") ? "image" : ("file" as const),
          url: URL.createObjectURL(file),
          name: file.name,
        }))
      );

      const newUserMessage: Message = {
        type: "user",
        content: input,
        id: crypto.randomUUID(),
        attachments: uploadedAttachments,
      };

      setMessages((prev) => [...prev, newUserMessage]);
      const currentInput = input;
      setInput("");
      setSelectedFiles([]);

      // Existing API call logic...
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.slice(-5),
          language: language, // Send language preference to API
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botResponse: Message = {
        type: "bot",
        content: data.message || t.processingError,
        id: crypto.randomUUID(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorResponse: Message = {
        type: "bot",
        content: t.error,
        id: crypto.randomUUID(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoadingResponse(false);
      setIsUploading(false);
    }
  };

  // Optimize initial animations
  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 z-50 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black group will-change-transform"
        aria-label="Open GYM BRO Assistant"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <MessageSquareText
          size={28}
          className="group-hover:rotate-6 transition-transform duration-200 will-change-transform"
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[80vh] flex flex-col bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden z-[60] backdrop-blur-xl will-change-transform"
          >
            <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-sm"></div>
              <div className="flex items-center relative z-10">
                <div className="relative">
                  <Bot size={28} className="text-white" />
                  <Sparkles
                    size={12}
                    className="absolute -top-1 -right-1 text-yellow-300 animate-pulse"
                  />
                </div>
                <div className="ml-3">
                  <h3
                    id="chatbot-title"
                    className="text-white font-bold text-lg"
                  >
                    {t.title}
                  </h3>
                  <p className="text-xs text-white/80">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="relative z-10 text-white/90 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm font-medium"
                >
                  {language.toUpperCase()}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 text-white/90 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent overscroll-y-contain">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  layoutId={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "flex w-full items-start gap-3",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "bot" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Bot size={18} className="text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] space-y-2",
                      message.type === "user" ? "items-end" : "items-start"
                    )}
                  >
                    {message.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className={cn(
                          "rounded-xl overflow-hidden border shadow-lg will-change-transform",
                          message.type === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400/20"
                            : "bg-zinc-800/90 border-zinc-700/50"
                        )}
                      >
                        {attachment.type === "image" ? (
                          <div className="relative aspect-video w-48 h-32 group">
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="object-cover w-full h-full rounded-xl transition-transform duration-200 will-change-transform group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <span className="absolute bottom-2 left-2 text-xs text-white truncate">
                                {attachment.name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 flex items-center gap-2 text-sm group hover:bg-zinc-700/20 transition-colors duration-200">
                            <FileIcon
                              size={16}
                              className={
                                message.type === "user"
                                  ? "text-white"
                                  : "text-indigo-400"
                              }
                            />
                            <span className="truncate group-hover:text-white transition-colors">
                              {attachment.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {message.content && (
                      <div
                        className={cn(
                          "p-3.5 text-sm leading-relaxed shadow-lg border will-change-transform",
                          message.type === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-sm border-indigo-400/20"
                            : "bg-zinc-800/90 text-gray-200 rounded-2xl rounded-bl-sm border-zinc-700/50"
                        )}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoadingResponse && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-start items-start gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-sm bg-zinc-800/90 text-gray-200 border border-zinc-700/50 shadow-lg">
                    <span className="flex items-center gap-3">
                      <Loader2
                        size={16}
                        className="animate-spin text-indigo-400"
                      />
                      <span className="text-sm">{t.loading}</span>
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {selectedFiles.length > 0 && (
              <div className="p-3 border-t border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-800">
                <div className="flex gap-2 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 p-2.5 rounded-xl text-sm text-gray-200 border border-zinc-700/50 transition-all duration-200 group shadow-lg"
                    >
                      {file.type.startsWith("image/") ? (
                        <ImageIcon size={14} className="text-indigo-400" />
                      ) : (
                        <FileIcon size={14} className="text-purple-400" />
                      )}
                      <span className="truncate max-w-[120px] group-hover:text-white transition-colors">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-white hover:bg-zinc-600/50 p-1 rounded-lg transition-all duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <footer className="p-4 border-t border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2 items-end"
              >
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="pr-10 bg-zinc-800/80 border-zinc-700/50 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 rounded-xl"
                    aria-label="Chat input"
                  />
                  <div className="absolute right-2 bottom-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                      onClick={() =>
                        setIsAttachmentMenuOpen(!isAttachmentMenuOpen)
                      }
                    >
                      <Paperclip size={16} className="transform rotate-45" />
                    </Button>
                    {isAttachmentMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute bottom-full right-0 mb-2 p-3 bg-zinc-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-zinc-700/50 flex flex-col gap-2 min-w-[180px]"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg group"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon
                            size={16}
                            className="text-indigo-400 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-sm">{t.addImage}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg group"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileIcon
                            size={16}
                            className="text-purple-400 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-sm">{t.addDocument}</span>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 px-4 h-10 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-purple-600 rounded-xl group"
                  disabled={
                    (!input.trim() && selectedFiles.length === 0) ||
                    isLoadingResponse
                  }
                >
                  {isUploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send
                      size={18}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  )}
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
