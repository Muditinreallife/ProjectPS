import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import type { User } from '../types';

import {
  startLabSession,
  completeTrainingSession,
  checkHealth,
} from '../api/labApi';

import { POST_LOGIN_REDIRECT_URL } from '../config';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  labSessionId: number | null;
  lastSubmitMessage: string | null;
  backendAvailable: boolean | null;
  login: (
    identifier: string,
    password: string
  ) => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  signup: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearLastMessage: () => void;
}

const DEFAULT_USER: User = {
  id: 'u-1',
  name: 'Training Participant',
  username: 'participant',
  avatar: '/assets/avatar-user.jpg',
  email: 'participant@lab.local',
  bio: 'Cybersecurity awareness training participant',
  isCloseFriend: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function makeParticipantId(identifier: string): string {
  const base = identifier
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40);

  return base || `participant-${Date.now()}`;
}

/**
 * Treat the backend as available when the local SQLite database is connected.
 */
function isBackendHealthy(
  health: Awaited<ReturnType<typeof checkHealth>>
): boolean {
  return health.database_connected === true;
}

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [labSessionId, setLabSessionId] = useState<number | null>(null);
  const [lastSubmitMessage, setLastSubmitMessage] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkBackend = async () => {
      try {
        const health = await checkHealth();

        if (!cancelled) {
          setBackendAvailable(isBackendHealthy(health));
        }
      } catch {
        if (!cancelled) {
          setBackendAvailable(false);
        }
      }
    };

    checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (
    identifier: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setLastSubmitMessage(null);

    try {
      const health = await checkHealth();

      if (!isBackendHealthy(health)) {
        setBackendAvailable(false);
        setLastSubmitMessage('Training backend is unavailable.');
        return false;
      }

      setBackendAvailable(true);

      const participantId = makeParticipantId(identifier);

      const start = await startLabSession(participantId);
      setLabSessionId(start.session_id);

      // Pass the password through to the training completion endpoint
      const result = await completeTrainingSession(
        start.session_id,
        identifier,
        password
      );

      if (!result.success) {
        setLastSubmitMessage(
          'Training completion could not be recorded.'
        );
        return false;
      }

      const loggedUser: User = {
        ...DEFAULT_USER,
        id: `lab-${start.session_id}`,
        username: participantId,
        name: 'Training Participant',
      };

      setUser(loggedUser);
      setIsAuthenticated(true);

      const target = (POST_LOGIN_REDIRECT_URL || '').trim();
      if (target) {
        window.location.assign(target);
      }

      return true;
    } catch {
      setLastSubmitMessage('Could not connect to the training backend.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    return false;
  };

  const signup = async (_data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLabSessionId(null);
    setLastSubmitMessage(null);
  };

  const clearLastMessage = () => {
    setLastSubmitMessage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        labSessionId,
        lastSubmitMessage,
        backendAvailable,
        login,
        loginWithFacebook,
        signup,
        logout,
        clearLastMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};