import { defineCollection, z } from 'astro:content';

const fieldNotesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(), // Auto-generated excerpt from content
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Your Name'), // Change this to your name
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    // For tracking the original WordPress data
    wpId: z.number().optional(),
    wpSlug: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['wip', 'archived']),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    image: z.string(), // path like '/assets/projects/my-project.jpg'
    url: z.string().url().optional(),
    tech: z.array(z.string()),
    notes: z.string().optional(),

    bentoItems: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      size: z.enum(['default', 'large', 'wide', 'tall']).default('default'),
      stat: z.string().optional(),
      tags: z.array(z.string()).optional(),
      hasFeatureIcon: z.boolean().optional(),
    })).optional(),
  }),
});

export const collections = {
  'field-notes': fieldNotesCollection,
  'projects': projectsCollection
};