import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioSession } from '../domain/portfolio/types';
import { PortfolioSessionSchema } from '../domain/portfolio/schema';

const SESSION_KEY = 'portfolio-builder:session:v1';

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
      const result = PortfolioSessionSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      } else {
        console.warn('Stored session is invalid according to current schema');
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
