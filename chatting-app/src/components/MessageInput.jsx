import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [completion, setCompletion] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage, messages } = useChatStore();
  const { authUser } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Generate smart suggestions based on message patterns
  const generateQuickReplies = (message) => {
    const text = message.toLowerCase();
    
    // Thanks/Gratitude
    if (text.includes("thank") || text.includes("thanks")) {
      return ["You're welcome!", "Happy to help!", "Anytime!"];
    }
    
    // Questions
    if (text.includes("?")) {
      return ["Yes", "No", "Let me check"];
    }
    
    // Greetings
    if (text.match(/\b(hi|hello|hey)\b/)) {
      return ["Hey!", "Hello!", "Hi there!"];
    }
    
    // Apologies
    if (text.includes("sorry")) {
      return ["No worries!", "It's okay", "Don't worry about it"];
    }
    
    // Invitations/Plans
    if (text.includes("want to") || text.includes("would you")) {
      return ["Sure!", "I'd love to", "Maybe later"];
    }
    
    // Agreement/Confirmation
    if (text.includes("okay") || text.includes("ok") || text.includes("sounds good")) {
      return ["Great!", "Perfect!", "Awesome!"];
    }
    
    // Default suggestions
    return ["Got it", "Okay", "Thanks"];
  };

  // Listen for new messages and show suggestions
  useEffect(() => {
    try {
      if (!messages || messages.length === 0 || !authUser || !authUser._id) {
        return;
      }
      
      const lastMessage = messages[messages.length - 1];
      
      // Only show suggestions if the last message is from someone else and has text
      if (lastMessage && lastMessage.senderId && lastMessage.senderId !== authUser._id && lastMessage.text) {
        const quickReplies = generateQuickReplies(lastMessage.text);
        setSuggestions(quickReplies);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
    }
  }, [messages, authUser]);

  // Hide suggestions when user starts typing
  useEffect(() => {
    if (text.length > 0) {
      setShowSuggestions(false);
    }
  }, [text]);

  // Smart message completion
  useEffect(() => {
    const fetchCompletion = async () => {
      if (text.length > 5 && text.trim().split(' ').length >= 2) {
        try {
          const response = await axiosInstance.post("/ai/complete", {
            partialMessage: text.trim()
          });
          
          if (response.data && response.data.completion) {
            setCompletion(response.data.completion);
            setShowCompletion(true);
          }
        } catch (error) {
          setShowCompletion(false);
        }
      } else {
        setShowCompletion(false);
      }
    };

    const timeoutId = setTimeout(fetchCompletion, 800); // Debounce
    return () => clearTimeout(timeoutId);
  }, [text]);

  // Handle Tab key to accept completion
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && showCompletion && completion) {
      e.preventDefault();
      setText(text + ' ' + completion);
      setShowCompletion(false);
      setCompletion("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
    setShowSuggestions(false);
  };

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message first");
      return;
    }

    setIsRewriting(true);
    try {
      const response = await axiosInstance.post("/ai/rewrite", {
        message: text.trim()
      });
      
      if (response.data && response.data.rewritten) {
        setText(response.data.rewritten);
        toast.success("Message rewritten!");
      } else {
        toast.error("Failed to rewrite message");
      }
    } catch (error) {
      console.error("Rewrite error:", error);
      toast.error(error.response?.data?.message || "Failed to rewrite message");
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setSuggestions([]);
      setShowSuggestions(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full border-t border-base-300 bg-base-100">
      {/* Smart Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-base-content/70">Smart Suggestions</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                hover:from-purple-500/20 hover:to-pink-500/20 border border-primary/20 
                text-sm font-medium whitespace-nowrap transition-all hover:scale-105 
                active:scale-95 shadow-sm hover:shadow-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border-2 border-primary/30 shadow-lg group-hover:scale-105 transition-transform"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content
              flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Type a message... (Tab to accept suggestion)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {showCompletion && completion && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <span className="opacity-0">{text}</span>
                <span className="text-base-content/30 italic ml-1">{completion}</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle ${
              imagePreview 
                ? "bg-success/20 text-success hover:bg-success/30 border-success/30" 
                : "btn-ghost text-base-content/60 hover:text-primary"
            } transition-all hover:scale-110`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* AI Rewrite Button */}
          <button
            type="button"
            className={`btn btn-circle ${
              text.trim() 
                ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30" 
                : "btn-ghost text-base-content/40"
            } transition-all hover:scale-110 ${isRewriting ? 'animate-pulse' : ''}`}
            onClick={handleRewrite}
            disabled={!text.trim() || isRewriting}
            title="Rewrite with AI"
          >
            <Sparkles size={20} className={isRewriting ? 'animate-spin' : ''} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-circle hover:scale-110 active:scale-95 transition-transform shadow-lg disabled:opacity-50"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
