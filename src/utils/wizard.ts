export const WIZARD_STEPS = [
  'profile',
  'experience',
  'projects',
  'skills',
  'ai',
  'editor'
] as const;

export type WizardStep = typeof WIZARD_STEPS[number];

export function getNextWizardStep(current: WizardStep): WizardStep | null {
  const index = WIZARD_STEPS.indexOf(current);
  if (index >= 0 && index < WIZARD_STEPS.length - 1) {
    return WIZARD_STEPS[index + 1];
  }
  return null;
}

export function getPreviousWizardStep(current: WizardStep): WizardStep | null {
  const index = WIZARD_STEPS.indexOf(current);
  if (index > 0) {
    return WIZARD_STEPS[index - 1];
  }
  return null;
}

export function getWizardRoute(step: WizardStep): any {
  return `/(wizard)/${step}` as any;
}
