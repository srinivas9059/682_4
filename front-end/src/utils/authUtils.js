import { auth } from '../firebase';
import { getIdToken, onIdTokenChanged } from 'firebase/auth';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const ACTIVITY_KEY = "lastActivity";
const TOKEN_KEY = "authToken";

// Token management
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken(true);
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

// Session management
export const initializeTokenRefresh = (user) => {
  if (!user) return () => {};

  // Initial token setup
  getAuthToken();

  // Set up token refresh
  const tokenRefreshInterval = setInterval(() => {
    getAuthToken();
  }, 10 * 60 * 1000); // Refresh token every 10 minutes

  return () => clearInterval(tokenRefreshInterval);
};

// Session activity tracking
export const updateLastActivity = () => {
  localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
};

// Session timeout check (30 minutes)
export const checkSessionTimeout = () => {
  const lastActivity = localStorage.getItem(ACTIVITY_KEY);
  if (!lastActivity) return true;

  const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
  return timeSinceLastActivity > SESSION_TIMEOUT;
};

export const getTimeUntilTimeout = () => {
  const lastActivity = localStorage.getItem(ACTIVITY_KEY);
  if (!lastActivity) return 0;

  const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
  const timeRemaining = SESSION_TIMEOUT - timeSinceLastActivity;
  return Math.max(0, timeRemaining);
};

export const clearAuthData = () => {
  localStorage.removeItem(ACTIVITY_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Function to verify if the current token is valid
export const verifyToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const token = await user.getIdToken();
    return !!token;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

// Function to handle user activity
export const setupActivityListeners = () => {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  const activityHandler = () => {
    if (!checkSessionTimeout()) {
      updateLastActivity();
    }
  };

  events.forEach(event => {
    document.addEventListener(event, activityHandler);
  });

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, activityHandler);
    });
  };
};

// API call wrapper with token
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Check session timeout
    if (checkSessionTimeout()) {
      await auth.signOut();
      throw new Error('Session timeout');
    }

    // Update last activity
    updateLastActivity();

    // Add token to headers
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try to refresh
        const newToken = await getAuthToken();
        if (newToken) {
          // Retry with new token
          headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return retryResponse;
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 