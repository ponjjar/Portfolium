import { convertToProject } from '../../../src/services/github/github-adapter';
import { GitHubRepoDetails } from '../../../src/services/github/github.schemas';
import { Project } from '../../../src/domain/portfolio/types';

describe('GitHub Adapter', () => {
  it('should convert GitHubRepoDetails to a Project', () => {
    const details: GitHubRepoDetails = {
      summary: {
        id: 123,
        name: 'test-repo',
        fullName: 'user/test-repo',
        description: 'Test description',
        htmlUrl: 'https://github.com/user/test-repo',
        homepage: 'https://test-repo.com',
        language: 'TypeScript',
        topics: ['react', 'web'],
        stars: 10,
        forks: 2,
        isFork: false,
        isArchived: false,
        updatedAt: '2023-01-01T00:00:00Z',
        defaultBranch: 'main',
        ownerLogin: 'user',
      },
      readme: '# Test Repo\n\nThis is a readme.',
      manifests: { packageJson: true },
      detectedTechnologies: ['TypeScript', 'React', 'Node.js'],
    };

    const project = convertToProject(details, [], 0);

    expect(project.id).toBe('project_github_123');
    expect(project.title).toBe('test-repo');
    expect(project.description).toContain('This is a readme');
    expect(project.source.type).toBe('github');
    expect(project.links.repository).toBe('https://github.com/user/test-repo');
    expect(project.links.demo).toBe('https://test-repo.com');
    expect(project.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(project.githubMetadata?.stars).toBe(10);
    expect(project.githubMetadata?.readmeFound).toBe(true);
    expect(project.order).toBe(0);
  });

  it('should return existing project if already imported', () => {
    const details: GitHubRepoDetails = {
      summary: {
        id: 123,
        name: 'test-repo',
        fullName: 'user/test-repo',
        description: 'New desc',
        htmlUrl: 'https://github.com/user/test-repo',
        homepage: null,
        language: null,
        topics: [],
        stars: 0,
        forks: 0,
        isFork: false,
        isArchived: false,
        updatedAt: '',
        defaultBranch: '',
        ownerLogin: 'user',
      },
      readme: null,
      manifests: {},
      detectedTechnologies: [],
    };

    const existingProject: Project = {
      id: 'custom_id',
      title: 'Edited Title',
      description: 'Edited desc',
      shortDescription: '',
      source: {
        type: 'github',
        repository: {
          owner: 'user',
          name: 'test-repo',
          url: 'https://github.com/user/test-repo'
        }
      },
      links: {},
      technologies: [],
      selected: true,
      featured: false,
      order: 1,
    };

    const result = convertToProject(details, [existingProject], 0);

    // It should not overwrite manually edited projects, just return the existing one
    expect(result).toBe(existingProject);
    expect(result.title).toBe('Edited Title');
  });
});
