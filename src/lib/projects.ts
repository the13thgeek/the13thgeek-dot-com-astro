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
