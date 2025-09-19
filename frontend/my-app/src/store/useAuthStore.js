// src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],

  // -------------------
  // SIGNUP
  // -------------------
  signup: async (data) => {
    console.log("🟡 signup() called with data:", data);
    set({ isSigningUp: true });

    try {
      console.log("🟡 Sending signup request to backend...");
      const res = await axiosInstance.post("/auth/signup", data, {
        withCredentials: true,
      });

      console.log("🟢 Backend response (signup):", res.data);

      // Set user state directly
      set({ authUser: res.data });
      toast.success("Account created successfully!");

      // Debug socket connection
      console.log("🟡 Connecting socket after signup...");
      get().connectSocket();

      set({ isSigningUp: false });
      console.log("🟢 Signup finished successfully");
      return res.data; // so frontend can use it
    } catch (err) {
      console.error("🔴 Signup error (store):", err);
      toast.error(err.response?.data?.message || "Signup failed");
      set({ isSigningUp: false });
      throw err;
    }
  },

  // -------------------
  // LOGIN
  // -------------------
  login: async (data) => {
    console.log("🟡 login() called with data:", data);
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });

      console.log("🟢 Backend response (login):", res.data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      get().connectSocket();
      set({ isLoggingIn: false });
      return res.data;
    } catch (err) {
      console.error("🔴 Login error (store):", err);
      toast.error(err.response?.data?.message || "Login failed");
      set({ isLoggingIn: false });
      throw err;
    }
  },

  // -------------------
  // LOGOUT
  // -------------------
  logout: async () => {
    console.log("🟡 logout() called");
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully!");
      console.log("🟢 Logout success");
    } catch (err) {
      console.error("🔴 Logout error:", err);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  },

  // -------------------
  // CHECK AUTH
  // -------------------
  checkAuth: async () => {
    console.log("🟡 checkAuth() called");
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/checkAuth", {
        withCredentials: true,
      });

      console.log("🟢 Auth check success:", res.data);
      set({ authUser: res.data, isCheckingAuth: false });
      get().connectSocket();
    } catch (err) {
      console.warn("🔴 Auth check failed:", err.response?.data || err);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  // -------------------
  // SOCKET CONNECTION
  // -------------------
  connectSocket: () => {
    const { authUser, socket } = get();
    console.log("🟡 connectSocket() called. Current user:", authUser);

    if (!authUser) {
      console.warn("⚠️ No authUser, socket not connected.");
      return;
    }
    if (socket) {
      console.warn("⚠️ Socket already connected.");
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { userId: authUser._id },
      withCredentials: true,
    });

    set({ socket: newSocket });

    newSocket.on("connect", () =>
      console.log("🟢 Socket connected:", newSocket.id)
    );
    newSocket.on("getOnlineUsers", (users) => {
      console.log("🟢 Online users update:", users);
      set({ onlineUsers: users ?? [] });
    });
    newSocket.on("disconnect", () =>
      console.log("🔴 Socket disconnected")
    );
  },

  disconnectSocket: () => {
    const { socket } = get();
    console.log("🟡 disconnectSocket() called. Current socket:", socket);

    if (socket) {
      socket.off();
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
      console.log("🟢 Socket fully disconnected");
    }
  },
}));

// Debug: log entire store state whenever it changes
useAuthStore.subscribe((state) => {
  console.log("📦 Store updated:", state);
});
