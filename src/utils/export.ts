import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import JSZip from 'jszip';
import { PortfolioSession, Project, Skill, SocialLink } from '@/domain/portfolio/types';
import { buildPortfolioViewModel } from '@/templates/viewModel';
import { renderMinimalTemplate } from '@/templates/minimal';

// Helper for Web download
const downloadWebFile = (blob: Blob, filename: string) => {
  if (typeof window === 'undefined') return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Helper for Native save & share
const shareNativeFile = async (stringContent: string, filename: string, isBase64: boolean = false) => {
  const FS = FileSystem as any;
  const fileUri = `${FS.documentDirectory || FS.cacheDirectory}${filename}`;
  await FS.writeAsStringAsync(fileUri, stringContent, {
    encoding: isBase64 ? FS.EncodingType.Base64 : FS.EncodingType.UTF8,
  });
  
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri);
  } else {
    console.warn('Sharing is not available on this device');
  }
};

/**
 * Defensively generates a clean, readable Markdown Resume / GitHub Profile README
 * from the user's sovereign portfolio session data.
 */
export function generateMarkdownResume(session: PortfolioSession): string {
  const profile = session.profile;
  const skills: Skill[] = session.skills || [];
  const projects: Project[] = session.projects || [];
  const socialLinks: SocialLink[] = session.socialLinks || [];

  const lines: string[] = [];

  // Header
  const name = profile?.name?.trim() || 'Software Developer';
  lines.push(`# ${name}`);
  if (profile?.headline?.trim()) {
    lines.push(`**${profile.headline.trim()}**\n`);
  }

  // Contact / Social Links
  const contactParts: string[] = [];
  if (profile?.email?.trim()) {
    contactParts.push(`[${profile.email.trim()}](mailto:${profile.email.trim()})`);
  }
  if (profile?.location?.trim()) {
    contactParts.push(`📍 ${profile.location.trim()}`);
  }
  socialLinks.forEach((link: SocialLink) => {
    if (link.url && link.label) {
      contactParts.push(`[${link.label.trim()}](${link.url.trim()})`);
    }
  });

  if (contactParts.length > 0) {
    lines.push(`${contactParts.join(' • ')}\n`);
  }

  // About / Bio
  if (profile?.bio?.trim()) {
    lines.push(`## About\n`);
    lines.push(`${profile.bio.trim()}\n`);
  }

  // Technical Skills
  const selectedSkills = skills.filter((s: Skill) => s.selected !== false && Boolean(s.name?.trim()));
  if (selectedSkills.length > 0) {
    lines.push(`## Technical Skills\n`);
    const categories = Array.from(new Set(selectedSkills.map((s: Skill) => s.category || 'General')));
    if (categories.length > 1) {
      categories.forEach((cat: string) => {
        const catSkills = selectedSkills.filter((s: Skill) => (s.category || 'General') === cat);
        if (catSkills.length > 0) {
          lines.push(`- **${cat}:** ${catSkills.map((s: Skill) => s.name.trim()).join(', ')}`);
        }
      });
      lines.push('');
    } else {
      lines.push(`${selectedSkills.map((s: Skill) => s.name.trim()).join(', ')}\n`);
    }
  }

  // Featured Projects
  const selectedProjects = projects
    .filter((p: Project) => p.selected !== false && Boolean(p.title?.trim()))
    .sort((a: Project, b: Project) => (a.order ?? 0) - (b.order ?? 0));

  if (selectedProjects.length > 0) {
    lines.push(`## Featured Projects\n`);
    selectedProjects.forEach((proj: Project) => {
      const title = proj.title?.trim() || 'Project';
      const linksPart: string[] = [];
      if (proj.links?.demo?.trim()) linksPart.push(`[Live Demo](${proj.links.demo.trim()})`);
      if (proj.links?.repository?.trim()) linksPart.push(`[Source Code](${proj.links.repository.trim()})`);
      const linksStr = linksPart.length > 0 ? ` (${linksPart.join(' • ')})` : '';

      lines.push(`### ${title}${linksStr}\n`);
      const desc = proj.description?.trim() || proj.shortDescription?.trim();
      if (desc) {
        lines.push(`${desc}\n`);
      }
      if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
        const techs = proj.technologies.filter((t: string) => Boolean(t && t.trim())).join(', ');
        if (techs) {
          lines.push(`**Stack:** ${techs}\n`);
        }
      }
    });
  }

  // Footer / Attribution
  lines.push(`---\n*Generated sovereignly with [Portfolium](https://github.com/ponjjar/Portfolium) — Local-First Identity Hub.*`);

  return lines.join('\n');
}

export const exportHtml = async (session: PortfolioSession) => {
  const viewModel = buildPortfolioViewModel(session);
  const html = renderMinimalTemplate(viewModel);
  
  if (Platform.OS === 'web') {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    downloadWebFile(blob, 'index.html');
  } else {
    await shareNativeFile(html, 'index.html');
  }
};

export const exportSessionJson = async (session: PortfolioSession) => {
  const json = JSON.stringify(session, null, 2);
  
  if (Platform.OS === 'web') {
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    downloadWebFile(blob, 'portfolio-session.json');
  } else {
    await shareNativeFile(json, 'portfolio-session.json');
  }
};

export const exportMarkdownResume = async (session: PortfolioSession) => {
  const markdown = generateMarkdownResume(session);
  
  if (Platform.OS === 'web') {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    downloadWebFile(blob, 'RESUME.md');
  } else {
    await shareNativeFile(markdown, 'RESUME.md');
  }
};

export const exportZip = async (session: PortfolioSession) => {
  const viewModel = buildPortfolioViewModel(session);
  const html = renderMinimalTemplate(viewModel);
  const json = JSON.stringify(session, null, 2);
  const markdown = generateMarkdownResume(session);

  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('portfolio-session.json', json);
  zip.file('README.md', markdown);
  
  if (Platform.OS === 'web') {
    const content = await zip.generateAsync({ type: 'blob' });
    downloadWebFile(content, 'portfolio.zip');
  } else {
    const base64 = await zip.generateAsync({ type: 'base64' });
    await shareNativeFile(base64, 'portfolio.zip', true);
  }
};

export const exportGitHubPagesReady = async (session: PortfolioSession) => {
  await exportZip(session);
};
