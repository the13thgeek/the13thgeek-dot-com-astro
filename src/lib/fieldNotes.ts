import { getCollection, type CollectionEntry } from 'astro:content';

export type FieldNote = CollectionEntry<'field-notes'>;

/**
 * Get all field notes sorted by publication date (newest first)
 */
export async function getAllFieldNotes(): Promise<FieldNote[]> {
  const notes = await getCollection('field-notes');
  return notes.sort((a, b) => 
    b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

/**
 * Get the latest N field notes
 * @param count - Number of posts to return (default: 3)
 */
export async function getLatestFieldNotes(count: number = 3): Promise<FieldNote[]> {
  const allNotes = await getAllFieldNotes();
  return allNotes.slice(0, count);
}

/**
 * Get field notes by category
 * @param category - Category name to filter by
 */
export async function getFieldNotesByCategory(category: string): Promise<FieldNote[]> {
  const allNotes = await getAllFieldNotes();
  return allNotes.filter(note => 
    note.data.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  );
}

/**
 * Get field notes by tag
 * @param tag - Tag name to filter by
 */
export async function getFieldNotesByTag(tag: string): Promise<FieldNote[]> {
  const allNotes = await getAllFieldNotes();
  return allNotes.filter(note => 
    note.data.tags.some(t => 
      t.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Get all unique categories from field notes
 */
export async function getAllCategories(): Promise<string[]> {
  const allNotes = await getAllFieldNotes();
  const categories = new Set<string>();
  
  allNotes.forEach(note => {
    note.data.categories.forEach(cat => categories.add(cat));
  });
  
  return Array.from(categories).sort();
}

/**
 * Get all unique tags from field notes
 */
export async function getAllTags(): Promise<string[]> {
  const allNotes = await getAllFieldNotes();
  const tags = new Set<string>();
  
  allNotes.forEach(note => {
    note.data.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Format a date for display
 * @param date - Date to format
 * @param style - Date format style ('full', 'long', 'medium', 'short')
 */
export function formatDate(date: Date, style: 'full' | 'long' | 'medium' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: style
  }).format(date);
}

/**
 * Convert a string to a URL-friendly slug
 * @param text - Text to slugify
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}