import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePortfolioStore } from '../../src/store/index';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Portfolio Store', () => {
  beforeEach(() => {
    usePortfolioStore.getState().resetSession();
  });

  it('should update profile and change updatedAt', () => {
    jest.useFakeTimers();
    const initialUpdatedAt = usePortfolioStore.getState().session.metadata.updatedAt;
    
    // Advance time to ensure updatedAt changes
    jest.advanceTimersByTime(1000);
    
    usePortfolioStore.getState().updateProfile({ name: 'Alex' });
    
    const state = usePortfolioStore.getState();
    expect(state.session.profile.name).toBe('Alex');
    expect(state.session.metadata.updatedAt).not.toBe(initialUpdatedAt);
    
    jest.useRealTimers();
  });

  it('should add and remove a project', () => {
    const newProject = {
      id: 'p1',
      title: 'Test',
      description: '',
      shortDescription: '',
      source: { type: 'manual' as const },
      links: {},
      technologies: [],
      selected: true,
      featured: false,
      order: 0,
    };
    
    usePortfolioStore.getState().addProject(newProject);
    expect(usePortfolioStore.getState().session.projects).toHaveLength(1);
    
    usePortfolioStore.getState().removeProject('p1');
    expect(usePortfolioStore.getState().session.projects).toHaveLength(0);
  });
});
