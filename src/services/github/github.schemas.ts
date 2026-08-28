export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  html_url: string;
  public_repos: number;
}

export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  pushed_at: string;
  updated_at: string;
  topics: string[];
}

export interface GitHubRepositorySummary {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  isFork: boolean;
  isArchived: boolean;
  updatedAt: string;
  defaultBranch: string;
  ownerLogin: string;
}

export interface GitHubRepoDetails {
  summary: GitHubRepositorySummary;
  readme: string | null;
  manifests: {
    packageJson?: boolean;
    requirementsTxt?: boolean;
    pomXml?: boolean;
    buildGradle?: boolean;
    cargoToml?: boolean;
    goMod?: boolean;
    composerJson?: boolean;
    pubspecYaml?: boolean;
    pyprojectToml?: boolean;
  };
  detectedTechnologies: string[];
}
