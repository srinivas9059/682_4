import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword as updatePasswordInAuth,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { 
  initializeTokenRefresh, 
  updateLastActivity, 
  checkSessionTimeout 
} from "../utils/authUtils";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Get stored token
      const storedToken = localStorage.getItem('authToken');
      
      if (user && storedToken) {
        setCurrentUser(user);
        updateLastActivity();
        setSessionExpired(false);
      } else if (!user) {
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('lastActivity');
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => {
      unsubscribe();
      setLoading(true); // Reset loading state when unmounting
    };
  }, []);

  // Initialize session monitoring
  useEffect(() => {
    if (!initialized) return;
    
    let unsubscribeToken = () => {};
    
    // Set up token refresh listener
    if (currentUser) {
      unsubscribeToken = initializeTokenRefresh(currentUser);
    }

    // Set up session activity monitoring
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      updateLastActivity();
      setSessionExpired(false);
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check session status periodically
    const sessionCheck = setInterval(() => {
      const isExpired = checkSessionTimeout();
      if (isExpired && !sessionExpired) {
        setSessionExpired(true);
        logout();
      }
    }, 60000); // Check every minute

    return () => {
      if (unsubscribeToken) unsubscribeToken();
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(sessionCheck);
    };
  }, [currentUser, sessionExpired, initialized]);

  async function signup(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      updateLastActivity();
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        const token = await result.user.getIdToken();
        localStorage.setItem('authToken', token);
        updateLastActivity();
        setSessionExpired(false);
        setCurrentUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        const token = await result.user.getIdToken();
        localStorage.setItem('authToken', token);
        updateLastActivity();
        setSessionExpired(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('lastActivity');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  async function updatePassword(password) {
    try {
      await updatePasswordInAuth(currentUser, password);
      updateLastActivity();
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  }

  async function deleteAccount() {
    try {
      await deleteUser(currentUser);
      localStorage.removeItem('authToken');
      localStorage.removeItem('lastActivity');
    } catch (error) {
      console.error("Account deletion error:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    sessionExpired,
    login,
    signInWithGoogle,
    signup,
    logout,
    resetPassword,
    updatePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
