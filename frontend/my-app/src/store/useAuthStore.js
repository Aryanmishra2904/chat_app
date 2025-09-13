import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast"



export const useAuthStore=create ((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpadating:false,

    isCheckingAuth:true,


    checkAuth:async ()=>{
        try {
    const res = await axiosInstance.get("/auth/checkAuth", { withCredentials: true });
    set({ authUser: res.data, isCheckingAuth: false });
     
  } catch (error) {
    console.error("❌ Error in checkAuth:", error.response?.data || error.message);
    set({ authUser: null, isCheckingAuth: false });
  }
        
    },
    signup:async(data) =>{
      set({isSigningUp:true})
      try {
        const res =await axiosInstance.post("/auth/signup",data)
        toast.success("Account created successfully")
        set({ authUser:res.data})
      } catch (error) {
        toast.error(error.response.data.message)
      }
      finally{
        set({isSigningUp:false})
      }
    },
    logout:async()=>{
      try {
        const res = await axiosInstance.post("/auth/logout",{},{withCredentials:true})
        set({authUser:null})
        toast.success("logged out successfully")

      } catch (error) {
        toast.error("somethimg went wrong")
        console.log(error.response.data.message)
      }
    }
}))
