import postsData from '../data/posts.json';

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  jetpack_featured_media_url?: string;
}

export class PostService {
  private wpUrl: string;
  private isDev: boolean;

  constructor() {
    this.wpUrl = import.meta.env.VITE_BLOG_WP_URL;
    this.isDev = import.meta.env.DEV;
  }

  async getPosts(): Promise<WPPost[]> {
    try {
      if (this.isDev) {
        // Return local data - no network request
        return postsData as WPPost[];
      } else {
        // Production: fetch from WordPress
        const res = await fetch(this.wpUrl);
        if (!res.ok) throw new Error('Failed to fetch from WP');
        return await res.json();
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      return [];
    } 
  }

  async getLatest(n = 5): Promise<WPPost[]> {
    const posts = await this.getPosts();
    return posts.slice(0, n);
  }
}