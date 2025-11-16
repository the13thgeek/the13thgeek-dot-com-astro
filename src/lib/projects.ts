import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<'projects'>;

export async function getAllProjects() {
    const projects = await getCollection('projects');
    return projects.sort((a, b) => {
    const orderA = a.data.order ?? 999;
    const orderB = b.data.order ?? 999;
    return orderA - orderB;
  });
}

export async function getFeaturedProjects() {
  const projects = await getAllProjects();
  return projects.filter(p => p.data.featured);
}

export async function getProjectsByType(type: 'wip' | 'past') {
  const projects = await getAllProjects();
  return projects.filter(p => p.data.type === type);
}

export function getBentoItemsWithTech(project: Project) {
  const items = project.data.bentoItems || [];
  
  // Optionally auto-add tech stack as first item if not manually specified
  const hasTechItem = items.some(item => item.title === 'Tech Stack');
  
  if (!hasTechItem && project.data.tech.length > 0) {
    return [
      {
        icon: '🚀',
        title: 'Tech Stack',
        description: 'Built with modern streaming technologies for real-time performance',
        size: 'large' as const,
        tags: project.data.tech,
      },
      ...items,
    ];
  }
  
  return items;
}