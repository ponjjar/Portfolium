import { Project } from '../../domain/portfolio/types';
import { GitHubRepoDetails } from './github.schemas';

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

  // If exists, we don't automatically overwrite it in this phase, 
  // but if we did, we would merge here. The caller should prevent this function from being called on duplicates.
  // We'll return a new Project or the merged one if needed.
  if (existing) {
    return existing; // DO NOT overwrite manually edited projects automatically.
  }

  // Extract a short description
  let shortDesc = summary.description || '';
  if (shortDesc.length > 150) {
    shortDesc = shortDesc.substring(0, 147) + '...';
  }

  // The full description could be the README content. If no readme or not a string, use the repository description.
  let fullDesc = '';
  if (typeof readme === 'string' && readme.trim()) {
    fullDesc = readme.substring(0, 1000);
    if (readme.length > 1000) fullDesc += '\n... (truncated)';
  } else {
    fullDesc = summary.description || '';
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
      readmeFound: !!readme,
    },
    selected: true,
    featured: false,
    order: orderIndex,
  };

  return project;
}
