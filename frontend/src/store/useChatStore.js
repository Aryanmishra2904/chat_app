import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  chats: {}, 
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data ?? [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => ({
        chats: { ...state.chats, [userId]: res.data ?? [] },
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, chats } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        chats: {
          ...chats,
          [selectedUser._id]: [...(chats[selectedUser._id] || []), res.data],
        },
      });

      const socket = useAuthStore.getState().socket;
      socket?.emit("sendMessage", { ...res.data, receiverId: selectedUser._id });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  },

  deleteMessage: async (messageId, userId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        chats: {
          ...state.chats,
          [userId]: (state.chats[userId] || []).filter(
            (msg) => msg._id !== messageId
          ),
        },
      }));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.on("newMessage", (message) => {
      const { chats } = get();
      set({
        chats: {
          ...chats,
          [message.senderId]: [...(chats[message.senderId] || []), message],
        },
      });
    });
    socket.off("messageDeleted");
    socket.on("messageDeleted", (messageId) => {
      const { chats, selectedUser } = get();
      if (!selectedUser) return;

      set({
        chats: {
          ...chats,
          [selectedUser._id]: (chats[selectedUser._id] || []).filter(
            (msg) => msg._id !== messageId
          ),
        },
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messageDeleted");
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
