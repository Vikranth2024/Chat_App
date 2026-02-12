import { useEffect } from 'react';

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";


import Navbar from './components/Navbar';
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useChatStore } from "./store/useChatStore";

import {Routes, Route, Navigate} from 'react-router-dom';

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );

  return (
    <div data-theme={theme} className="min-h-screen transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Navigate to="/settings" />} />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;

