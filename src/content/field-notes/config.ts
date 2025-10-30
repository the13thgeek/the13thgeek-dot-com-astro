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

export const collections = {
  'field-notes': fieldNotesCollection,
};