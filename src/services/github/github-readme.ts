import { GitHubRepositorySummary } from './github.schemas';

export async function fetchRepositoryReadme(
  repo: GitHubRepositorySummary,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    // The raw media type returns the raw content of the README
    const headers = {
      Accept: 'application/vnd.github.v3.raw',
    };
    
    // We use fetchFromGitHub but expect a string return type because of the raw media type,
    // wait, fetchFromGitHub uses `.json()`. We should not use fetchFromGitHub directly if we want raw text.
    // Let's create a custom fetch here to handle raw text.
    const url = `https://api.github.com/repos/${repo.ownerLogin}/${repo.name}/readme`;
    
    const requestHeaders = new Headers(headers);
    requestHeaders.set('User-Agent', 'Portfolio-Builder-App');

    const controller = new AbortController();
    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      // Just return null for other errors as README is optional
      return null;
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    // Return null if network fails specifically for README
    return null;
  }
}
