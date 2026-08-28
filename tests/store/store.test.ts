import { usePortfolioStore } from '../../src/store';
import { loadSession, saveSession, clearSession } from '../../src/storage';
import { PortfolioSessionSchema } from '../../src/domain/portfolio/schema';

// Mock storage
jest.mock('../../src/storage', () => ({
  loadSession: jest.fn(),
  saveSession: jest.fn(),
  clearSession: jest.fn(),
}));

describe('Portfolio Store', () => {
  beforeEach(() => {
    usePortfolioStore.getState().resetSession();
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = usePortfolioStore.getState();
    const defaultSession = PortfolioSessionSchema.parse({});
    
    // Ignore timestamps for equality check
    const stateSession = { ...state.session, metadata: { ...state.session.metadata, createdAt: '', updatedAt: '' } };
    const expectedSession = { ...defaultSession, metadata: { ...defaultSession.metadata, createdAt: '', updatedAt: '' } };
    
    expect(stateSession).toEqual(expectedSession);
  });

  it('should update profile', () => {
    jest.useFakeTimers();
    usePortfolioStore.getState().updateProfile({ name: 'John Doe' });
    
    const state = usePortfolioStore.getState();
    expect(state.session.profile.name).toBe('John Doe');
    
    jest.advanceTimersByTime(1000);
    expect(saveSession).toHaveBeenCalledWith(usePortfolioStore.getState().session);
    jest.useRealTimers();
  });

  it('should import valid session JSON', () => {
    jest.useFakeTimers();
    const state = usePortfolioStore.getState();
    const validJson = {
      schemaVersion: 1,
      profile: { name: 'Alice' }
    };
    
    const success = state.importSession(validJson);
    expect(success).toBe(true);
    expect(usePortfolioStore.getState().session.profile.name).toBe('Alice');
    
    jest.advanceTimersByTime(1000);
    expect(saveSession).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should reject invalid session JSON on import', () => {
    const state = usePortfolioStore.getState();
    const invalidJson = {
      profile: { name: 123 }
    };
    
    const success = state.importSession(invalidJson);
    expect(success).toBe(false);
    expect(usePortfolioStore.getState().session.profile.name).toBe('');
    expect(saveSession).not.toHaveBeenCalled();
  });
});
