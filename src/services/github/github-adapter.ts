import { Project } from '../../domain/portfolio/types';
import { GitHubRepoDetails } from './github.schemas';
import { sanitizeReadmeForAi, extractCleanSummaryFromReadme } from './github-readme';

export function convertToProject(
  repoDetails: GitHubRepoDetails,
  existingProjects: Project[],
  orderIndex: number
): Project {
  const { summary, readme, detectedTechnologies } = repoDetails;
  
  // Find if already exists
  const existing = existingProjects.find(
    (p) => p.source.type === 'github' && p.source.repository.url === summary.htmlUrl
  );

  // If exists, we don't automatically overwrite it in this phase
  if (existing) {
    return existing;
  }

  // Sanitized raw markdown for storage and future AI module ingestion
  const sanitizedRawReadme = typeof readme === 'string' && readme.trim()
    ? sanitizeReadmeForAi(readme)
    : '';

  // Extract a short description
  let shortDesc = summary.description || '';
  if (!shortDesc && sanitizedRawReadme) {
    shortDesc = extractCleanSummaryFromReadme(sanitizedRawReadme, 150);
  }
  if (shortDesc.length > 150) {
    shortDesc = shortDesc.substring(0, 147) + '...';
  }

  // Full description: repository description or extracted summary from README
  let fullDesc = summary.description || '';
  if (!fullDesc && sanitizedRawReadme) {
    fullDesc = extractCleanSummaryFromReadme(sanitizedRawReadme, 600);
  }

  const project: Project = {
    id: `project_github_${summary.id}`,
    title: summary.name,
    description: fullDesc,
    shortDescription: shortDesc,
    source: {
      type: 'github',
      repository: {
        owner: summary.ownerLogin,
        name: summary.name,
        url: summary.htmlUrl,
        defaultBranch: summary.defaultBranch,
      }
    },
    links: {
      repository: summary.htmlUrl,
      demo: summary.homepage || undefined,
    },
    image: summary.selectedImage || undefined,
    technologies: detectedTechnologies,
    githubMetadata: {
      primaryLanguage: summary.language || undefined,
      topics: summary.topics,
      stars: summary.stars,
      readmeFound: !!sanitizedRawReadme,
      rawReadme: sanitizedRawReadme || undefined,
    },
    selected: true,
    featured: false,
    order: orderIndex,
  };

  return project;
}
