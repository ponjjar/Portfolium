import { GitHubRepositorySummary } from './github.schemas';

export interface ImageCandidate {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Resolves a URL extracted from a README against the repository root if it's relative.
 */
function resolveImageUrl(src: string, repo: GitHubRepositorySummary): string {
  // If it's already an absolute URL, leave it.
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  
  // Clean up leading slashes or dots
  let path = src;
  if (path.startsWith('./')) path = path.slice(2);
  if (path.startsWith('/')) path = path.slice(1);
  
  // GitHub raw content URL format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
  const branch = repo.defaultBranch || 'main';
  return `https://raw.githubusercontent.com/${repo.ownerLogin}/${repo.name}/${branch}/${path}`;
}

/**
 * Filters out obvious badges and tracking pixels.
 */
function isBadgeOrTracking(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.includes('shields.io') ||
    lowerUrl.includes('travis-ci.org') ||
    lowerUrl.includes('travis-ci.com') ||
    lowerUrl.includes('coveralls.io') ||
    lowerUrl.includes('badge') ||
    lowerUrl.includes('sonarcloud.io') ||
    lowerUrl.includes('circleci.com') ||
    lowerUrl.includes('github.com/a/workflows') || // GitHub Actions badge
    lowerUrl.includes('analytics')
  ) {
    return true;
  }
  return false;
}

/**
 * Validates dimensions by loading the image in the DOM (Web only implementation).
 * React Native could use Image.getSize but since Portfolio Builder is running primarily in Web,
 * we use the Image object for quick intrinsic dimension checks.
 */
function checkImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    // If not in a browser environment, just return a dummy size to bypass validation
    if (typeof Image === 'undefined') {
      resolve({ width: 500, height: 500 });
      return;
    }
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Fetches the README HTML, parses image tags, resolves them, and filters them by size.
 */
export async function extractReadmeImages(repo: GitHubRepositorySummary): Promise<ImageCandidate[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo.ownerLogin}/${repo.name}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.html+json',
        'User-Agent': 'Portfolio-Builder-App'
      },
      // Timeout to avoid hanging imports
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      return []; // No readme or error, just return empty
    }
    
    const html = await response.text();
    
    // Extract all img src attributes
    // This regex looks for <img ... src="url" ... >
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const candidates = new Set<string>();
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src && !isBadgeOrTracking(src)) {
        candidates.add(resolveImageUrl(src, repo));
      }
    }
    
    const validCandidates: ImageCandidate[] = [];
    
    // Process candidates and check dimensions
    const promises = Array.from(candidates).map(async (url) => {
      try {
        const dimensions = await checkImageDimensions(url);
        // Exclude if it failed to load or is smaller than 100x100
        if (dimensions && dimensions.width >= 100 && dimensions.height >= 100) {
          validCandidates.push({
            url,
            width: dimensions.width,
            height: dimensions.height
          });
        }
      } catch (e) {
        // Ignore broken images
      }
    });
    
    await Promise.all(promises);
    return validCandidates;
    
  } catch (error) {
    console.warn(`Failed to extract README images for ${repo.fullName}:`, error);
    return [];
  }
}

export async function fetchRepositoryReadme(
  repo: GitHubRepositorySummary,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const url = `https://api.github.com/repos/${repo.ownerLogin}/${repo.name}/readme`;
    
    const requestHeaders = new Headers({
      Accept: 'application/vnd.github.v3.raw',
    });
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
      return null;
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}
