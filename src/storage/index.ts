import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioSession } from '../domain/portfolio/types';
import { PortfolioSessionSchema } from '../domain/portfolio/schema';

const SESSION_KEY = 'portfolio-builder:session:v1';

export const migratePortfolioSession = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  // Future migrations can be placed here based on data.schemaVersion
  // e.g., if (data.schemaVersion === 1) { ... data.schemaVersion = 2; }

  return data;
};

export const saveSession = async (session: PortfolioSession): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(session);
    await AsyncStorage.setItem(SESSION_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save session to storage', e);
  }
};

export const loadSession = async (): Promise<PortfolioSession | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSION_KEY);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue);
      const migrated = migratePortfolioSession(parsed);
      const result = PortfolioSessionSchema.safeParse(migrated);
      if (result.success) {
        return result.data;
      } else {
        console.warn('Stored session is invalid according to current schema', result.error);
      }
    }
  } catch (e) {
    console.error('Failed to load session from storage', e);
  }
  return null;
};

export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session from storage', e);
  }
};
