import { normalizeGitHubUsername } from '../../../src/services/github/github-client';

describe('GitHub Client', () => {
  describe('normalizeGitHubUsername', () => {
    it('should extract username from valid github urls', () => {
      expect(normalizeGitHubUsername('https://github.com/ponjjar')).toBe('ponjjar');
      expect(normalizeGitHubUsername('http://github.com/ponjjar/')).toBe('ponjjar');
      expect(normalizeGitHubUsername('github.com/ponjjar/portfolio-builder')).toBe('ponjjar');
    });

    it('should return plain usernames as is', () => {
      expect(normalizeGitHubUsername('ponjjar')).toBe('ponjjar');
      expect(normalizeGitHubUsername(' john_doe ')).toBe('john_doe');
    });

    it('should handle empty input', () => {
      expect(normalizeGitHubUsername('')).toBe('');
      expect(normalizeGitHubUsername('   ')).toBe('');
    });
  });
});
