import { detectTechnologies } from '../../../src/services/github/github-manifests';
import { GitHubRepositorySummary } from '../../../src/services/github/github.schemas';

describe('GitHub Manifests', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeAll(() => {
    originalFetch = globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it('should detect technologies from package.json', async () => {
    const pkgData = {
      dependencies: {
        'react': '^18.0.0',
        'zustand': '1.0.0'
      },
      devDependencies: {
        'typescript': '^4.0.0'
      }
    };

    globalThis.fetch = jest.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('package.json')) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify(pkgData),
          json: async () => pkgData,
        };
      }
      return { ok: false, status: 404 };
    }) as any;

    const repo: GitHubRepositorySummary = {
      id: 1,
      name: 'test',
      fullName: 'owner/test',
      description: '',
      htmlUrl: '',
      homepage: null,
      language: 'JavaScript',
      topics: [],
      stars: 0,
      forks: 0,
      isFork: false,
      isArchived: false,
      updatedAt: '',
      defaultBranch: '',
      ownerLogin: 'owner',
    };

    const result = await detectTechnologies(repo);
    expect(result.manifests['packageJson']).toBe(true);
    
    // primary language
    expect(result.detectedTechnologies).toContain('JavaScript');
    // from mapping
    expect(result.detectedTechnologies).toContain('Node.js');
    expect(result.detectedTechnologies).toContain('React');
    expect(result.detectedTechnologies).toContain('Zustand');
    expect(result.detectedTechnologies).toContain('TypeScript');
  });
});
