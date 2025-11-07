import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { TrashIcon } from "lucide-react";

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
  

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200">
      <ChatHeader />

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
            </div>
            
          </div>
        ))}
      </div>
      
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
