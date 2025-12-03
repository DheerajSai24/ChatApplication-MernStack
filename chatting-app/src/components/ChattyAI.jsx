import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ChattyAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! I'm Chatty AI. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAIAvailable, setIsAIAvailable] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check AI availability on mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkAIStatus = async () => {
    try {
      const response = await axiosInstance.get("/ai/status");
      setIsAIAvailable(response.data.available);
      if (!response.data.available) {
        setMessages([
          {
            role: "ai",
            content: "I apologize, but I am currently unavailable. Please try again later.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to check AI status:", error);
      setIsAIAvailable(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !isAIAvailable) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Show loading
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/ai/chat", {
        message: userMessage,
      });

      // Add AI response
      const aiMessage = {
        role: "ai",
        content: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast.error(error.response?.data?.message || "Failed to get AI response");

      // Add error message
      const errorMessage = {
        role: "ai",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 
            rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 
            flex items-center justify-center z-50 group animate-pulse hover:animate-none"
        >
          <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
          flex flex-col z-50 overflow-hidden border border-purple-200 dark:border-purple-900 animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Chatty AI</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {isAIAvailable ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md border border-gray-100 dark:border-gray-600"
                  }`}
                >
                  {message.role === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        Chatty AI
                      </span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 shadow-md border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm">Chatty AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isAIAvailable ? "Ask me anything..." : "AI is offline"}
                disabled={isLoading || !isAIAvailable}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 
                  disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading || !isAIAvailable}
                className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                  text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all hover:scale-110 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChattyAI;
