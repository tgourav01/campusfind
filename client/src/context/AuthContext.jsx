
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campusfind_user')) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Verify the saved login session when the app starts
  useEffect(() => {
    let active = true;

    async function verifySession() {
      const token = localStorage.getItem('campusfind_token');

      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get('/auth/me');

        if (active) {
          setUser(res.data.user);
          localStorage.setItem(
            'campusfind_user',
            JSON.stringify(res.data.user)
          );
        }
      } catch (error) {
        if (active) {
          localStorage.removeItem('campusfind_token');
          localStorage.removeItem('campusfind_user');
          setUser(null);
        }

        console.error(
          'Session verification failed:',
          error.response?.data?.message || error.message
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  // Login existing user
  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password
      });

      const { token, user: loggedInUser } = res.data;

      if (!token || !loggedInUser) {
        throw new Error('Invalid login response from server.');
      }

      localStorage.setItem('campusfind_token', token);
      localStorage.setItem(
        'campusfind_user',
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message
      );

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      );
    }
  }

  // Register new user
  async function register(data) {
    try {
      const res = await api.post('/auth/register', data);

      const { token, user: registeredUser } = res.data;

      if (!token || !registeredUser) {
        throw new Error('Invalid registration response from server.');
      }

      localStorage.setItem('campusfind_token', token);
      localStorage.setItem(
        'campusfind_user',
        JSON.stringify(registeredUser)
      );

      setUser(registeredUser);

      return registeredUser;
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data?.message || error.message
      );

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.'
      );
    }
  }

  // Logout current user
  function logout() {
    localStorage.removeItem('campusfind_token');
    localStorage.removeItem('campusfind_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
