import { createContext, useContext } from 'react';


export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (!context) {
      console.error('AuthContext exists but has no value');
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  } catch (err) {
    console.error('Error accessing AuthContext:', err);
    throw err;
  }
};

export const AuthContext = createContext();

