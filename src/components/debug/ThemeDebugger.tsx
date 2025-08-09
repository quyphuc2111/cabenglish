"use client";

import React, { useState, useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useSession } from 'next-auth/react';
import { enableThemeSync, disableThemeSync, isThemeSyncEnabled } from '@/utils/theme-sync';

interface ThemeDebuggerProps {
  userId?: string;
}

export function ThemeDebugger({ userId }: ThemeDebuggerProps) {
  const { data: session } = useSession();
  const { data: userInfo, isLoading, error, dataUpdatedAt } = useUserInfo(userId || session?.user?.userId);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setSyncEnabled(isThemeSyncEnabled());
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  const handleToggleSync = () => {
    if (syncEnabled) {
      disableThemeSync();
      setSyncEnabled(false);
    } else {
      enableThemeSync();
      setSyncEnabled(true);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🎨 Theme Debugger</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Current Theme:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-white ${
            userInfo?.theme === 'theme-gold' ? 'bg-theme-gold-primary' :
            userInfo?.theme === 'theme-blue' ? 'bg-theme-blue-primary' :
            userInfo?.theme === 'theme-pink' ? 'bg-theme-pink-primary' :
            'bg-theme-red-primary'
          }`}>
            {userInfo?.theme || 'Loading...'}
          </span>
        </div>
        
        <div>
          <strong>Loading:</strong> {isLoading ? '🔄' : '✅'}
        </div>
        
        <div>
          <strong>Error:</strong> {error ? '❌' : '✅'}
        </div>
        
        <div>
          <strong>Last Update:</strong> {lastUpdate?.toLocaleTimeString() || 'Never'}
        </div>
        
        <div>
          <strong>Sync Enabled:</strong> 
          <button 
            onClick={handleToggleSync}
            className={`ml-2 px-2 py-1 rounded text-white text-xs ${
              syncEnabled ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {syncEnabled ? '✅ ON' : '❌ OFF'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-600 text-xs">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
