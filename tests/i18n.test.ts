import pt from '../src/i18n/locales/pt-BR.json';
import en from '../src/i18n/locales/en.json';

function getNestedKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getNestedKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}

describe('i18n Strict Validation (Rule 6 Parity)', () => {
  const ptKeys = getNestedKeys(pt);
  const enKeys = getNestedKeys(en);

  it('should have exact key parity between pt.json and en.json', () => {
    const missingInEn = ptKeys.filter((k) => !enKeys.includes(k));
    const missingInPt = enKeys.filter((k) => !ptKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInPt).toEqual([]);
    expect(ptKeys.length).toBe(enKeys.length);
  });

  it('should not contain empty translation values', () => {
    for (const key of ptKeys) {
      const ptValue = getNestedValue(pt, key);
      const enValue = getNestedValue(en, key);

      expect(typeof ptValue).toBe('string');
      expect(typeof enValue).toBe('string');
      expect(ptValue.trim().length).toBeGreaterThan(0);
      expect(enValue.trim().length).toBeGreaterThan(0);
    }
  });

  it('should contain all required core namespaces', () => {
    const requiredNamespaces = ['common', 'welcome', 'profile', 'projects', 'skills', 'ai', 'github', 'theme'];
    const ptNamespaces = Object.keys(pt.translation);
    const enNamespaces = Object.keys(en.translation);

    for (const ns of requiredNamespaces) {
      expect(ptNamespaces).toContain(ns);
      expect(enNamespaces).toContain(ns);
    }
  });
});
