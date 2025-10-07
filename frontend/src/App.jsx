import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { subscribeToMessages, unsubscribeFromMessages, onlineUsers } = useChatStore();
  
  // Check authentication on load
  useEffect(() => { checkAuth(); }, [checkAuth]);

  // Subscribe to chat socket events when authenticated
  useEffect(() => {
    if (authUser) subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);


  if (isCheckingAuth) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />

      {authUser && (
        <div className="fixed bottom-2 right-2 bg-gray-100 dark:bg-gray-800 p-2 shadow rounded text-xs">
          Online users: {onlineUsers?.length ? onlineUsers.join(", ") : "None"}
        </div>
      )}
    </div>
  );
};

export default App;