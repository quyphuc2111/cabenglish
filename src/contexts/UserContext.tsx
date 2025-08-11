"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { UserInfo } from '@/types/user';

interface UserContextType {
  userInfo: UserInfo | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  userId?: string;
}

export function UserProvider({ children, userId }: UserProviderProps) {
  // SINGLE useUserInfo call cho toàn bộ app
  const { 
    data: userInfo, 
    isLoading, 
    error, 
    refetch 
  } = useUserInfo(userId);

  const value: UserContextType = {
    userInfo,
    isLoading,
    error: error as Error | null,
    refetch
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook để sử dụng UserContext
export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}

// Hook tương thích với useUserInfo cũ
export function useUserFromContext() {
  const { userInfo, isLoading, error } = useUser();
  
  return {
    data: userInfo,
    isLoading,
    error
  };
}
