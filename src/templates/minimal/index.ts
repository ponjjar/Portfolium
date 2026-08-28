import { PortfolioViewModel } from '../viewModel';
import { escapeHtml } from '@/utils/htmlSecurity';

export function renderMinimalTemplate(viewModel: PortfolioViewModel): string {
  const { profile, projects, skills, theme, settings, sections, socialLinks } = viewModel;

  const accentColor = theme.accent || '#3b82f6'; // default blue
  const isDark = theme.mode === 'dark';
  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedColor = isDark ? '#a1a1aa' : '#6b7280';
  const surfaceColor = isDark ? '#171717' : '#f3f4f6';
  const borderColor = isDark ? '#262626' : '#e5e7eb';

  // Sort sections
  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  // Generate CSS
  const css = `
    :root {
      --bg: ${bgColor};
      --text: ${textColor};
      --muted: ${mutedColor};
      --surface: ${surfaceColor};
      --border: ${borderColor};
      --accent: ${accentColor};
      --font-sans: system-ui, -apple-system, sans-serif;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: var(--text);
      text-decoration: none;
      transition: color 0.2s;
    }

    a:hover {
      color: var(--accent);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    section {
      margin-bottom: 4rem;
    }

    h1, h2, h3 {
      font-weight: 700;
      line-height: 1.2;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }

    .muted {
      color: var(--muted);
    }

    /* Hero Section */
    .hero {
      text-align: center;
      padding: 4rem 0;
    }
    
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1.5rem;
      border: 2px solid var(--border);
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--muted);
      max-width: 600px;
      margin: 1rem auto;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 500;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      background: var(--surface);
    }
    
    .btn:hover {
      border-color: var(--accent);
    }

    /* Projects Section */
    .projects-grid {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }

    .project-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
      border-bottom: 1px solid var(--border);
    }

    .project-content {
      padding: 1.5rem;
    }

    .project-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .project-desc {
      color: var(--muted);
      margin-bottom: 1.5rem;
    }

    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tech-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 9999px;
      color: var(--muted);
    }
    
    .project-links {
      display: flex;
      gap: 1rem;
    }
    
    .project-link {
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Skills Section */
    .skills-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }

    .skill-category h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }

    .skill-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* Footer */
    footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--muted);
      border-top: 1px solid var(--border);
      margin-top: 4rem;
      font-size: 0.875rem;
    }
  `;

  // --- Render Sections ---
  
  // Hero
  const renderHero = () => {
    return `
      <section id="hero" class="hero">
        ${settings.showAvatar && profile.avatar ? `<img class="avatar" src="${escapeHtml(profile.avatar.value)}" alt="${escapeHtml(profile.name)}" />` : ''}
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="muted">${escapeHtml(profile.headline)}</p>
        <p>${escapeHtml(profile.bio)}</p>
        
        <div class="social-links">
          ${socialLinks.map(link => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn">
              ${escapeHtml(link.label)}
            </a>
          `).join('')}
        </div>
      </section>
    `;
  };

  // Projects
  const renderProjects = () => {
    if (projects.length === 0) return '';
    
    return `
      <section id="projects">
        <h2>Selected Projects</h2>
        <div class="projects-grid">
          ${projects.map(p => `
            <article class="project-card">
              ${settings.showProjectImages && p.image ? `<img class="project-image" src="${escapeHtml(p.image.value)}" alt="${escapeHtml(p.title)}" loading="lazy" />` : ''}
              <div class="project-content">
                <h3 class="project-title">${escapeHtml(p.title)}</h3>
                <p class="project-desc">${escapeHtml(p.shortDescription || p.description)}</p>
                
                <div class="project-tech">
                  ${p.technologies.map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('')}
                </div>
                
                <div class="project-links">
                  ${p.links?.demo ? `<a href="${escapeHtml(p.links.demo)}" target="_blank" rel="noopener noreferrer" class="project-link">View Project &rarr;</a>` : ''}
                  ${settings.showGitHubLinks && p.links?.repository ? `<a href="${escapeHtml(p.links.repository)}" target="_blank" rel="noopener noreferrer" class="project-link">Source Code</a>` : ''}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  };

  // Skills
  const renderSkills = () => {
    if (skills.length === 0) return '';
    
    // Group skills manually since skillGroups might not be fully populated yet in MVP
    const grouped: Record<string, typeof skills> = {};
    skills.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    return `
      <section id="skills">
        <h2>Skills & Technologies</h2>
        <div class="skills-container">
          ${Object.entries(grouped).map(([category, catSkills]) => `
            <div class="skill-category">
              <h3>${escapeHtml(settings.showSkillCategories ? category : '')}</h3>
              <ul class="skill-list">
                ${catSkills.map(s => `<li>${escapeHtml(s.name)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  };

  // Compose body based on ordered sections
  let bodyContent = '';
  visibleSections.forEach(section => {
    if (section.id === 'hero') bodyContent += renderHero();
    if (section.id === 'projects') bodyContent += renderProjects();
    if (section.id === 'skills') bodyContent += renderSkills();
  });

  // Final HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(profile.name)} - Portfolio</title>
  <meta name="description" content="${escapeHtml(profile.headline)}">
  <style>
    ${css}
  </style>
</head>
<body>
  <main class="container">
    ${bodyContent}
  </main>
  
  <footer>
    <div class="container">
      &copy; ${new Date().getFullYear()} ${escapeHtml(profile.name)}. All rights reserved.
      <br><span style="opacity: 0.5; font-size: 0.75rem;">Built with Portfolio Builder</span>
    </div>
  </footer>
</body>
</html>`;
}
