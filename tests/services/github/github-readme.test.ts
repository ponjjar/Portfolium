import {
  decodeBase64Utf8,
  sanitizeReadmeForAi,
  extractCleanSummaryFromReadme,
} from '../../../src/services/github/github-readme';

describe('GitHub README Service', () => {
  describe('decodeBase64Utf8', () => {
    it('should correctly decode UTF-8 base64 encoded text with special characters', () => {
      // "Construção de Portfólios com IA & Tecnologias Modernas 🚀"
      const original = 'Construção de Portfólios com IA & Tecnologias Modernas 🚀';
      const encoded = Buffer.from(original, 'utf-8').toString('base64');

      const decoded = decodeBase64Utf8(encoded);
      expect(decoded).toBe(original);
    });

    it('should handle whitespace and newlines inside base64 strings', () => {
      const original = 'Hello World';
      const encoded = 'SGVs\nbG8g\nV29ybGQ=\n';
      expect(decodeBase64Utf8(encoded)).toBe(original);
    });
  });

  describe('sanitizeReadmeForAi', () => {
    it('should strip inline base64 images and HTML comments', () => {
      const raw = `# Project Title
<!-- This is a comment that should be stripped -->
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com)

Here is an image: ![Inline](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)

This is the real project description.`;

      const sanitized = sanitizeReadmeForAi(raw);

      expect(sanitized).not.toContain('data:image/png;base64');
      expect(sanitized).not.toContain('This is a comment');
      expect(sanitized).not.toContain('shields.io');
      expect(sanitized).toContain('This is the real project description.');
    });

    it('should truncate excessively long READMEs to prevent token overflow', () => {
      const longText = 'A'.repeat(8000);
      const sanitized = sanitizeReadmeForAi(longText, 5000);

      expect(sanitized.length).toBeLessThan(5100);
      expect(sanitized).toContain('... (truncated for AI processing)');
    });
  });

  describe('extractCleanSummaryFromReadme', () => {
    it('should extract the first meaningful text paragraph ignoring headers and badges', () => {
      const markdown = `# Awesome Project
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An open-source developer tool designed to automate stunning portfolios and resumes in seconds.

## Features
- Fast
- Clean`;

      const summary = extractCleanSummaryFromReadme(markdown);
      expect(summary).toBe('An open-source developer tool designed to automate stunning portfolios and resumes in seconds.');
    });
  });
});
