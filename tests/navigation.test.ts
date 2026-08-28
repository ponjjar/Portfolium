import { getNextWizardStep, getPreviousWizardStep, getWizardRoute } from '../src/utils/wizard';

describe('Wizard Navigation', () => {
  it('should return next step correctly', () => {
    expect(getNextWizardStep('profile')).toBe('projects');
    expect(getNextWizardStep('projects')).toBe('skills');
    expect(getNextWizardStep('skills')).toBe('ai');
    expect(getNextWizardStep('ai')).toBe('editor');
    expect(getNextWizardStep('editor')).toBeNull();
  });

  it('should return previous step correctly', () => {
    expect(getPreviousWizardStep('profile')).toBeNull();
    expect(getPreviousWizardStep('projects')).toBe('profile');
    expect(getPreviousWizardStep('skills')).toBe('projects');
    expect(getPreviousWizardStep('ai')).toBe('skills');
    expect(getPreviousWizardStep('editor')).toBe('ai');
  });

  it('should construct correct routes', () => {
    expect(getWizardRoute('profile')).toBe('/(wizard)/profile');
    expect(getWizardRoute('projects')).toBe('/(wizard)/projects');
  });
});
