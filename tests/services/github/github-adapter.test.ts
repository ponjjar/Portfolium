import { convertToProject } from '../../../src/services/github/github-adapter';
import { GitHubRepoDetails } from '../../../src/services/github/github.schemas';
import { Project } from '../../../src/domain/portfolio/types';

describe('GitHub Adapter', () => {
  it('should convert GitHubRepoDetails to a Project with sanitized rawReadme', () => {
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
      readme: '# Test Repo\n\nThis is the markdown body of the readme.',
      manifests: { packageJson: true },
      detectedTechnologies: ['TypeScript', 'React', 'Node.js'],
    };

    const project = convertToProject(details, [], 0);

    expect(project.id).toBe('project_github_123');
    expect(project.title).toBe('test-repo');
    expect(project.description).toBe('Test description');
    expect(project.githubMetadata?.rawReadme).toContain('This is the markdown body of the readme.');
    expect(project.source.type).toBe('github');
    expect(project.links.repository).toBe('https://github.com/user/test-repo');
    expect(project.links.demo).toBe('https://test-repo.com');
    expect(project.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(project.githubMetadata?.stars).toBe(10);
    expect(project.githubMetadata?.readmeFound).toBe(true);
    expect(project.order).toBe(0);
  });

  it('should extract clean summary from readme if repository description is empty', () => {
    const details: GitHubRepoDetails = {
      summary: {
        id: 456,
        name: 'empty-desc-repo',
        fullName: 'user/empty-desc-repo',
        description: null,
        htmlUrl: 'https://github.com/user/empty-desc-repo',
        homepage: null,
        language: 'Python',
        topics: [],
        stars: 5,
        forks: 0,
        isFork: false,
        isArchived: false,
        updatedAt: '',
        defaultBranch: 'main',
        ownerLogin: 'user',
      },
      readme: '# AI Framework\n\n[![Badge](badge.svg)](link)\n\nA high-performance automated pipeline for code synthesis.\n\n## Setup',
      manifests: {},
      detectedTechnologies: ['Python'],
    };

    const project = convertToProject(details, [], 1);

    expect(project.description).toBe('A high-performance automated pipeline for code synthesis.');
    expect(project.shortDescription).toBe('A high-performance automated pipeline for code synthesis.');
    expect(project.githubMetadata?.rawReadme).toContain('A high-performance automated pipeline for code synthesis.');
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

    expect(result).toBe(existingProject);
    expect(result.title).toBe('Edited Title');
  });
});
