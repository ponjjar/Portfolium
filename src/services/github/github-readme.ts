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
 * Sanitizes markdown content for AI consumption following strict rules.
 */
export function sanitizeReadmeForAi(rawReadme: string, maxChars = 5000): string {
  // 1. Validate if string is empty
  if (!rawReadme || typeof rawReadme !== 'string') return '';
  
  let text = rawReadme;

  // Handle potential HTML payload (e.g. if we accidentally got rendered GitHub page)
  if (text.includes('<div id="readme"') || text.includes('class="markdown-body"')) {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      // 8. Remove unwanted elements before extracting text
      const unwantedSelectors = ['img', 'picture', 'script', 'style', 'iframe', 'video', 'noscript', 'svg'];
      unwantedSelectors.forEach(sel => {
        const elements = doc.querySelectorAll(sel);
        elements.forEach(el => el.parentNode?.removeChild(el));
      });

      const article = doc.querySelector('article.markdown-body');
      const readmeDiv = doc.querySelector('#readme');
      
      if (article) {
        text = article.textContent || '';
      } else if (readmeDiv) {
        text = readmeDiv.textContent || '';
      } else {
        text = doc.body.textContent || '';
      }
    } else {
      // Node.js fallback for HTML
      text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      text = text.replace(/<(img|picture|iframe|video|noscript|svg)[^>]*>/gi, '');
      // Strip all remaining HTML tags
      text = text.replace(/<[^>]+>/g, ' ');
    }
  }

  // 1. Validate if empty after HTML strip
  if (!text.trim()) return '';

  // 2. Normalize newlines
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 3. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // 4. Remove base64 images
  text = text.replace(/data:image\/[^;]+;base64,[^\s"')]+/gi, '');

  // 5. Remove embedded SVGs
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, '');

  // 8. Remove specific tags if they are raw HTML inside Markdown
  text = text.replace(/<(img|picture|script|style|iframe|video|noscript)\b[^>]*>([\s\S]*?<\/\1>)?/gi, '');

  // 7. Remove badges: [![badge](imagem)](link)
  text = text.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '');

  // 6. Remove Markdown images: ![alt](url)
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');

  // 9. Convert Markdown links to visible text: [texto](url) -> texto
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 10. Remove code blocks ``` or ~~~
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/~~~[\s\S]*?~~~/g, '');

  // 11. Preserve inline code but remove backticks
  text = text.replace(/`([^`]+)`/g, '$1');

  // Removed: Markdown formatting (headers, lists, etc) is kept as AI models process it well

  // 13. Remove redundant spaces/newlines
  text = text.replace(/[ \t]+/g, ' '); // collapse spaces
  text = text.replace(/\n\s*\n/g, '\n\n').trim();

  // 14-16. Truncate carefully
  if (text.length > maxChars) {
    const truncationNotice = '\n\n... (truncated for AI processing)';
    const effectiveLimit = maxChars - truncationNotice.length;
    
    // 15. Avoid cutting last word
    let truncated = text.substring(0, effectiveLimit);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > effectiveLimit * 0.8) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    text = truncated + truncationNotice;
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
export async function extractReadmeImages(repo: GitHubRepositorySummary, getToken?: () => Promise<string | undefined>): Promise<ImageCandidate[]> {
  try {
    const endpoint = `/repos/${repo.ownerLogin}/${repo.name}/readme`;
    const turnstileToken = getToken ? await getToken() : undefined;
    
    // We expect HTML+JSON
    let html = '';
    try {
      html = await fetchFromGitHub<any>(endpoint, {
        headers: {
          'Accept': 'application/vnd.github.html+json',
        },
        turnstileToken,
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
  signal?: AbortSignal,
  getToken?: () => Promise<string | undefined>
): Promise<string | null> {
  try {
    const endpoint = `/repos/${repo.ownerLogin}/${repo.name}/readme`;
    const turnstileToken = getToken ? await getToken() : undefined;
    
    const rawResponse = await fetchFromGitHub<any>(endpoint, {
      headers: {
        'Accept': 'application/vnd.github.raw+json',
      },
      turnstileToken,
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
