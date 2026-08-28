import { GitHubRepositorySummary } from './github.schemas';

// Mapping known files to technologies
const FILE_TO_TECH_MAP: Record<string, string> = {
  'package.json': 'Node.js',
  'requirements.txt': 'Python',
  'pom.xml': 'Java',
  'build.gradle': 'Java/Kotlin',
  'Cargo.toml': 'Rust',
  'go.mod': 'Go',
  'composer.json': 'PHP',
  'pubspec.yaml': 'Flutter/Dart',
  'pyproject.toml': 'Python',
};

// Common JS/TS dependencies to map to technologies
const JS_DEP_TO_TECH: Record<string, string> = {
  'react': 'React',
  'react-native': 'React Native',
  'expo': 'Expo',
  'next': 'Next.js',
  'vue': 'Vue.js',
  'angular': '@angular/core',
  'svelte': 'Svelte',
  'express': 'Express',
  'nestjs': '@nestjs/core',
  'tailwindcss': 'Tailwind CSS',
  'typescript': 'TypeScript',
  'zustand': 'Zustand',
  'zod': 'Zod',
};

async function checkFileExists(owner: string, repo: string, path: string, signal?: AbortSignal): Promise<boolean> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Portfolio-Builder-App' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}

async function fetchPackageJson(owner: string, repo: string, signal?: AbortSignal): Promise<any | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;
  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Portfolio-Builder-App',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function detectTechnologies(
  repo: GitHubRepositorySummary,
  signal?: AbortSignal
): Promise<{ manifests: Record<string, boolean>; detectedTechnologies: string[] }> {
  const manifests: Record<string, boolean> = {};
  const detectedTechnologies = new Set<string>();

  // Add primary language
  if (repo.language) {
    detectedTechnologies.add(repo.language);
  }

  // Check common manifests
  const manifestChecks = Object.keys(FILE_TO_TECH_MAP).map(async (filename) => {
    if (filename === 'package.json') {
      const pkg = await fetchPackageJson(repo.ownerLogin, repo.name, signal);
      if (pkg) {
        manifests['packageJson'] = true;
        detectedTechnologies.add(FILE_TO_TECH_MAP[filename]);
        
        // Analyze dependencies
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {}),
          ...(pkg.peerDependencies || {}),
        };

        for (const [dep, tech] of Object.entries(JS_DEP_TO_TECH)) {
          if (allDeps[dep] || allDeps[tech]) { // Some deps are mapped by exact name like @angular/core
            detectedTechnologies.add(tech);
          }
        }
      } else {
        manifests['packageJson'] = false;
      }
    } else {
      const exists = await checkFileExists(repo.ownerLogin, repo.name, filename, signal);
      if (exists) {
        // Camel case the key e.g. requirements.txt -> requirementsTxt
        const key = filename.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        manifests[key] = true;
        detectedTechnologies.add(FILE_TO_TECH_MAP[filename]);
      }
    }
  });

  await Promise.allSettled(manifestChecks);

  return {
    manifests,
    detectedTechnologies: Array.from(detectedTechnologies),
  };
}
