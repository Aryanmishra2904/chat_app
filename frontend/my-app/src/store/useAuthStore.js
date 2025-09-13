import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile:false,

  // ✅ Check if user is logged in
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/checkAuth", {
        withCredentials: true, // send cookie
      });
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.error("❌ Error in checkAuth:", error.response?.data || error.message);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  // ✅ Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data, {
        withCredentials: true, // backend sets JWT cookie
      });
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
  updateProfile: async (data)=>{
    set({isUpdatingProfile:true})
    try {
      const res = await axiosInstance.post("/auth/updateProfile",data)
      set({ authUser : res.data })
      toast.success("Profile Image updated successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "not uploaded successfully")
    }finally{
      set({isUpdatingProfile:false})
    }
  }
}));
