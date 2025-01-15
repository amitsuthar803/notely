import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  userData: UserData | null;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        setUserData(JSON.parse(savedData));
      } else {
        // Set default user data
        const defaultData = {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        };
        await AsyncStorage.setItem('userData', JSON.stringify(defaultData));
        setUserData(defaultData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (newData: Partial<UserData>) => {
    try {
      const updatedData = { ...userData, ...newData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
