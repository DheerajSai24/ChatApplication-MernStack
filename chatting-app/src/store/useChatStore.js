import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log("📥 Raw users from API:", res.data.length);
      
      // Remove any potential duplicates based on _id
      const uniqueUsers = res.data.filter((user, index, self) =>
        index === self.findIndex((u) => u._id === user._id)
      );
      
      console.log("✅ Unique users after filtering:", uniqueUsers.length);
      
      if (res.data.length !== uniqueUsers.length) {
        console.warn("⚠️ Duplicates found and removed:", res.data.length - uniqueUsers.length);
      }
      
      set({ users: uniqueUsers });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
    socket.on("messageDeleted", (messageId) => {
      const { messages } = get();
      const updatedMessages = messages.filter((msg) => msg._id !== messageId);
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      // Make the API call to delete the message
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      
      // Update local state by filtering out the deleted message
      const updatedMessages = messages.filter((msg) => msg._id !== messageId);
      set({ messages: updatedMessages });

      toast.success("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error.message);
      toast.error("Failed to delete message");
    }
  },
}));