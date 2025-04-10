import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import {
  initializeTokenRefresh,
  checkSessionTimeout,
  getTimeUntilTimeout,
  clearAuthData,
  setupActivityListeners,
  verifyToken
} from '../utils/authUtils';

const SessionManager = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [timeoutWarningShown, setTimeoutWarningShown] = useState(false);

  useEffect(() => {
    // If auth is not yet initialized, don't do anything
    if (!auth) return;
    
    const { currentUser, logout } = auth;
    let timeoutCheck;
    let tokenCleanup;

    const handleSession = async () => {
      if (currentUser) {
        // Initialize token refresh
        tokenCleanup = await initializeTokenRefresh(currentUser);

        // Set up activity listeners
        const cleanupActivityListeners = setupActivityListeners();

        // Check session status periodically
        timeoutCheck = setInterval(async () => {
          const isTokenValid = await verifyToken();
          
          if (!isTokenValid || checkSessionTimeout()) {
            handleSessionTimeout();
          } else {
            const timeRemaining = getTimeUntilTimeout();
            
            // Show warning when 5 minutes remaining
            if (timeRemaining < 5 * 60 * 1000 && !timeoutWarningShown) {
              showTimeoutWarning(Math.floor(timeRemaining / 60000));
              setTimeoutWarningShown(true);
            }
          }
        }, 30000); // Check every 30 seconds

        return () => {
          clearInterval(timeoutCheck);
          if (tokenCleanup) tokenCleanup();
          cleanupActivityListeners();
        };
      }
    };

    handleSession();

    return () => {
      if (timeoutCheck) clearInterval(timeoutCheck);
      if (tokenCleanup) tokenCleanup();
    };
  }, [auth]);

  const handleSessionTimeout = async () => {
    if (!auth) return;
    
    try {
      await auth.logout();
      clearAuthData();
      notifications.show({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        color: 'red'
      });
      navigate('/login');
    } catch (error) {
      console.error('Error handling session timeout:', error);
    }
  };

  const showTimeoutWarning = (minutesRemaining) => {
    notifications.show({
      title: 'Session Expiring Soon',
      message: `Your session will expire in ${minutesRemaining} minutes. Please save your work.`,
      color: 'yellow',
      autoClose: false
    });
  };

  return null;
};

export default SessionManager; 