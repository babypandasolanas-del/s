import React from 'react';

// Offline storage utilities for PWA functionality
export class OfflineStorage {
  private static readonly STORAGE_KEYS = {
    USER_DATA: 'mindlevel_user_data',
    DAILY_QUESTS: 'mindlevel_daily_quests',
    LAST_SYNC: 'mindlevel_last_sync',
    PENDING_ACTIONS: 'mindlevel_pending_actions'
  };

  // Save user data for offline access
  static saveUserData(userData: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error saving user data offline:', error);
    }
  }

  // Get cached user data
  static getUserData(): any | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving offline user data:', error);
      return null;
    }
  }

  // Save daily quests for offline access
  static saveDailyQuests(quests: any[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
    } catch (error) {
      console.error('Error saving quests offline:', error);
    }
  }

  // Get cached daily quests
  static getDailyQuests(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.DAILY_QUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving offline quests:', error);
      return [];
    }
  }

  // Queue actions for when back online
  static queuePendingAction(action: any): void {
    try {
      const pending = this.getPendingActions();
      pending.push({
        ...action,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(this.STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(pending));
    } catch (error) {
      console.error('Error queuing pending action:', error);
    }
  }

  // Get pending actions to sync
  static getPendingActions(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PENDING_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving pending actions:', error);
      return [];
    }
  }

  // Clear pending actions after successful sync
  static clearPendingActions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.PENDING_ACTIONS);
    } catch (error) {
      console.error('Error clearing pending actions:', error);
    }
  }

  // Check if app is offline
  static isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get last sync timestamp
  static getLastSync(): Date | null {
    try {
      const timestamp = localStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  // Clear all offline data
  static clearOfflineData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};