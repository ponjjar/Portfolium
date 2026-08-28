import { fetchFromGitHub } from './github-client';
import { GitHubUser, GitHubRepoResponse, GitHubRepositorySummary } from './github.schemas';

export async function fetchGitHubUser(username: string, signal?: AbortSignal): Promise<GitHubUser> {
  return fetchFromGitHub<GitHubUser>(`/users/${username}`, { signal });
}

function mapRepoToSummary(repo: GitHubRepoResponse): GitHubRepositorySummary {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    topics: repo.topics || [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isFork: repo.fork,
    isArchived: repo.archived,
    updatedAt: repo.updated_at,
    defaultBranch: repo.default_branch,
    ownerLogin: repo.owner.login,
  };
}

export async function fetchAllPublicRepositories(
  username: string, 
  signal?: AbortSignal,
  onProgress?: (fetchedCount: number) => void
): Promise<GitHubRepositorySummary[]> {
  const perPage = 100;
  let page = 1;
  const allRepos: GitHubRepositorySummary[] = [];

  while (true) {
    if (signal?.aborted) {
      throw new Error('Aborted');
    }

    const repos = await fetchFromGitHub<GitHubRepoResponse[]>(
      `/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
      { signal }
    );

    if (repos.length === 0) {
      break;
    }

    const summaries = repos.map(mapRepoToSummary);
    allRepos.push(...summaries);

    if (onProgress) {
      onProgress(allRepos.length);
    }

    if (repos.length < perPage) {
      break;
    }

    page++;
  }

  return allRepos;
}
