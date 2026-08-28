import { GitHubRepositorySummary } from './github.schemas';
import { fetchFromGitHub, GitHubNotFoundError } from './github-client';

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
 * Decodes a base64 string handling UTF-8 characters safely in both browser and node/react-native.
 */
export function decodeBase64Utf8(base64Str: string): string {
  try {
    const clean = base64Str.replace(/\s/g, '');
    if (typeof atob === 'function') {
      const binary = atob(clean);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder('utf-8').decode(bytes);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(clean, 'base64').toString('utf-8');
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Sanitizes markdown content for AI consumption:
 * 1. Strips base64/data URI inline images
 * 2. Strips shields/badges and tracking URLs
 * 3. Strips HTML comments and large embedded scripts/SVGs
 * 4. Truncates cleanly to maxChars (default 5000 chars ~ 1200 tokens)
 */
export function sanitizeReadmeForAi(rawReadme: string, maxChars = 5000): string {
  if (!rawReadme || typeof rawReadme !== 'string') return '';

  let text = rawReadme;

  // 1. Remove base64 data URIs (huge memory footprint)
  text = text.replace(/data:image\/[^;]+;base64,[^\s"')]+/gi, '[Image]');

  // 2. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Remove SVG embeds
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, '');

  // 4. Remove badge/shield links like [![...](...)](...) or <a><img></a>
  text = text.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/gi, '');
  text = text.replace(/<a\b[^>]*><img\b[^>]*><\/a>/gi, '');

  // 5. Clean up redundant whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  // 6. Truncate cleanly up to maxChars
  if (text.length > maxChars) {
    text = text.substring(0, maxChars) + '\n\n... (truncated for AI processing)';
  }

  return text;
}

/**
 * Extracts a concise clean text summary from README to serve as an initial description.
 */
export function extractCleanSummaryFromReadme(rawReadme: string, maxChars = 300): string {
  if (!rawReadme) return '';
  const sanitized = sanitizeReadmeForAi(rawReadme, 3000);

  const lines = sanitized.split('\n');
  const paragraphLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraphLines.length > 0) break;
      continue;
    }
    // Skip Markdown headers, images, badges, code blocks
    if (trimmed.startsWith('#') || trimmed.startsWith('!') || trimmed.startsWith('```') || trimmed.startsWith('<')) {
      continue;
    }
    paragraphLines.push(trimmed);
  }

  let summary = paragraphLines.join(' ').trim();
  if (!summary) return '';

  if (summary.length > maxChars) {
    summary = summary.substring(0, maxChars - 3) + '...';
  }
  return summary;
}

/**
 * Fetches the README HTML, parses image tags, resolves them, and filters them by size.
 */
export async function extractReadmeImages(repo: GitHubRepositorySummary): Promise<ImageCandidate[]> {
  try {
    const endpoint = `/repos/${repo.ownerLogin}/${repo.name}/readme`;
    
    // We expect HTML+JSON
    let html = '';
    try {
      html = await fetchFromGitHub<any>(endpoint, {
        headers: {
          'Accept': 'application/vnd.github.html+json',
        },
        timeoutMs: 5000,
      });
    } catch (error) {
      if (error instanceof GitHubNotFoundError) return [];
      throw error;
    }
    
    // Extract all img src attributes
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
    
    const promises = Array.from(candidates).map(async (url) => {
      try {
        const dimensions = await checkImageDimensions(url);
        if (dimensions && dimensions.width >= 100 && dimensions.height >= 100) {
          validCandidates.push({
            url,
            width: dimensions.width,
            height: dimensions.height
          });
        }
      } catch {
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

/**
 * Fetches and decodes the repository README content as raw Markdown text.
 */
export async function fetchRepositoryReadme(
  repo: GitHubRepositorySummary,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const endpoint = `/repos/${repo.ownerLogin}/${repo.name}/readme`;
    
    const rawResponse = await fetchFromGitHub<any>(endpoint, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
      signal,
      timeoutMs: 10000,
    });

    if (!rawResponse) return null;

    // Case 1: Text format returned directly
    if (typeof rawResponse === 'string') {
      // Check if it's stringified JSON from fallback/proxy
      if (rawResponse.trim().startsWith('{') && rawResponse.includes('"content":')) {
        try {
          const parsed = JSON.parse(rawResponse);
          if (parsed.content && parsed.encoding === 'base64') {
            return decodeBase64Utf8(parsed.content);
          }
        } catch {
          // Continue with raw text
        }
      }
      return rawResponse;
    }

    // Case 2: Object from GitHub JSON API with base64 content
    if (typeof rawResponse === 'object') {
      if (rawResponse.content && rawResponse.encoding === 'base64') {
        return decodeBase64Utf8(rawResponse.content);
      }
      if (typeof rawResponse.content === 'string') {
        return rawResponse.content;
      }
    }

    return null;
  } catch (error) {
    if (error instanceof GitHubNotFoundError) {
      return null;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}
