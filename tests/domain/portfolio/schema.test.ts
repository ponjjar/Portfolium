import { PortfolioSessionSchema } from '../../../src/domain/portfolio/schema';

describe('PortfolioSession Schema', () => {
  it('should parse an empty object and apply defaults', () => {
    const result = PortfolioSessionSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaVersion).toBe(1);
      expect(result.data.profile).toEqual({
        name: '',
        headline: '',
        bio: '',
      });
      expect(result.data.projects).toEqual([]);
      expect(result.data.skills).toEqual([]);
      expect(result.data.portfolio.theme).toEqual({
        mode: 'dark',
        accent: '#FFFFFF',
      });
      expect(result.data.portfolio.template).toBe('minimal');
    }
  });

  it('should reject invalid JSON structures gracefully when parsing', () => {
    const invalidData = {
      profile: {
        name: 123, // should be string
      }
    };
    const result = PortfolioSessionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
