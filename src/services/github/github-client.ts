export class GitHubRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubRateLimitError';
  }
}

export class GitHubNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubNotFoundError';
  }
}

export class GitHubApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchFromGitHub<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract just the path if a full URL was accidentally passed
  let path = endpoint;
  if (path.startsWith('http')) {
    try {
      const urlObj = new URL(path);
      path = urlObj.pathname + urlObj.search;
    } catch {
      // Fallback
    }
  }

  const url = isDevelopment 
    ? `https://api.github.com${path}`
    : `/api/github?endpoint=${encodeURIComponent(path)}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/vnd.github.v3+json');
  // Explicitly adding User-Agent as it's required by GitHub API, though browsers might override it
  headers.set('User-Agent', 'Portfolio-Builder-App');

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get('x-ratelimit-remaining');
      if (remaining === '0') {
        throw new GitHubRateLimitError('GitHub API rate limit exceeded.');
      }
      // Could also be secondary rate limit
      throw new GitHubRateLimitError('GitHub API rate limit or abuse detection triggered.');
    }

    if (response.status === 404) {
      throw new GitHubNotFoundError(`Resource not found: ${endpoint}`);
    }

    if (!response.ok) {
      throw new GitHubApiError(`GitHub API error: ${response.statusText}`, response.status);
    }

    const acceptHeader = headers.get('Accept') || '';
    if (acceptHeader.includes('.raw') || acceptHeader.includes('.html')) {
      return await response.text() as unknown as T;
    }

    return await response.json() as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout: ${endpoint}`);
    }
    throw error;
  }
}

/**
 * Normalizes a GitHub URL or username into just the username.
 */
export function normalizeGitHubUsername(input: string): string {
  let normalized = input.trim();
  if (!normalized) return '';

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  if (normalized.includes('github.com/')) {
    const parts = normalized.split('github.com/');
    if (parts.length > 1) {
      // Get the first path segment after github.com/
      normalized = parts[1].split('/')[0];
    }
  }

  return normalized;
}
