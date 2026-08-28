import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioSessionSchema } from '../../src/domain/portfolio/schema';
import { migratePortfolioSession } from '../../src/storage/index';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Portfolio Session', () => {
  it('should parse an empty object into a valid default session', () => {
    const result = PortfolioSessionSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaVersion).toBe(1);
      expect(result.data.profile.name).toBe('');
      expect(result.data.projects).toEqual([]);
    }
  });

  it('should invalidate incorrect schema versions if strict checked (currently defaults to 1)', () => {
    const result = PortfolioSessionSchema.safeParse({ schemaVersion: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should run migration properly', () => {
    const oldData = { someOldField: true };
    const migrated = migratePortfolioSession(oldData);
    expect(migrated).toEqual({ someOldField: true }); // No-op for now but exists
  });
});
