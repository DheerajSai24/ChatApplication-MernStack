import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { TrashIcon, Languages, FileText, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [translatingMessages, setTranslatingMessages] = useState({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const handleDeleteMessage = (messageId) => {
    useChatStore.getState().deleteMessage(messageId);
  };

  const handleTranslate = async (messageId, messageText) => {
    if (translatedMessages[messageId]) {
      // Toggle - remove translation
      setTranslatedMessages(prev => {
        const newState = { ...prev };
        delete newState[messageId];
        return newState;
      });
      return;
    }

    setTranslatingMessages(prev => ({ ...prev, [messageId]: true }));
    
    try {
      const response = await axiosInstance.post("/ai/translate", {
        message: messageText,
        targetLanguage: "English"
      });
      
      if (response.data && response.data.translated) {
        setTranslatedMessages(prev => ({
          ...prev,
          [messageId]: response.data.translated
        }));
        toast.success("Translated to English!");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error(error.response?.data?.message || "Failed to translate");
    } finally {
      setTranslatingMessages(prev => {
        const newState = { ...prev };
        delete newState[messageId];
        return newState;
      });
    }
  };

  const handleSummarize = async () => {
    if (messages.length < 3) {
      toast.error("Need at least 3 messages to summarize");
      return;
    }

    setIsSummarizing(true);
    try {
      const formattedMessages = messages.map(msg => ({
        sender: msg.senderId === authUser._id ? "You" : selectedUser.fullName,
        text: msg.text || "[Image]"
      }));

      const response = await axiosInstance.post("/ai/summarize", {
        messages: formattedMessages
      });
      
      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
        toast.success("Conversation summarized!");
      }
    } catch (error) {
      console.error("Summarize error:", error);
      toast.error(error.response?.data?.message || "Failed to summarize");
    } finally {
      setIsSummarizing(false);
    }
  };
  

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200">
      <ChatHeader />

      {/* Summarize Button */}
      {messages.length >= 3 && (
        <div className="px-4 pt-2">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="btn btn-sm btn-ghost gap-2 hover:bg-primary/10"
          >
            <FileText className="w-4 h-4" />
            {isSummarizing ? "Summarizing..." : "Summarize Conversation"}
          </button>
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="mx-4 mt-2 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Conversation Summary
            </h4>
            <button onClick={() => setSummary(null)} className="btn btn-xs btn-ghost">
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm text-base-content/80 whitespace-pre-line">{summary}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            ref={messageEndRef}
          >
            <div className="chat-header mb-1 flex items-center gap-2">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {message.senderId !== authUser._id && message.text && (
                <button
                  onClick={() => handleTranslate(message._id, message.text)}
                  className={`hover:scale-110 transition-all duration-200 pl-2 ${
                    translatingMessages[message._id] ? 'animate-pulse' : ''
                  } ${translatedMessages[message._id] ? 'text-primary' : 'text-base-content/50 hover:text-primary'}`}
                  aria-label="Translate message"
                  disabled={translatingMessages[message._id]}
                >
                  <Languages className="h-4 w-4" />
                </button>
              )}
              {message.senderId === authUser._id && (
              <button
                onClick={() => handleDeleteMessage(message._id)}
                className="text-error/70 hover:text-error hover:scale-110 transition-all duration-200 pl-2"
                aria-label="Delete message" 
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
            </div>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border-2 border-primary/20 shadow-md hover:border-primary/40 transition-all duration-200">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            
            <div className={`chat-bubble flex flex-col shadow-lg ${
              message.senderId === authUser._id 
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-content" 
                : "bg-base-300/80 backdrop-blur-sm"
            } hover:shadow-xl transition-shadow duration-200`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-lg mb-2 shadow-md hover:scale-105 transition-transform duration-200"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
              {translatedMessages[message._id] && (
                <div className="mt-2 pt-2 border-t border-base-content/10">
                  <p className="text-xs opacity-70 mb-1">English:</p>
                  <p className="break-words italic">{translatedMessages[message._id]}</p>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
      
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
