import type { CollectionEntry } from 'astro:content';

/** Filter out drafts and future posts, sort by publishDate descending */
export function getPublishedPosts(
  posts: CollectionEntry<'blog'>[],
): CollectionEntry<'blog'>[] {
  const now = new Date();
  return posts
    .filter((post) => {
      if (post.data.draft) return false;
      const date = post.data.publishDate;
      if (date && date > now) return false;
      return true;
    })
    .sort((a, b) => {
      return (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0);
    });
}

/** Filter blog posts: exclude hidden, drafts, future */
export function getVisibleBlogPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return getPublishedPosts(posts).filter((p) => !p.data.hideFromStream);
}

/** Collect all unique tags across posts */
export function collectTags(posts: { data: { tags?: string[]; categories?: string[] } }[]): Map<string, number> {
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    for (const cat of post.data.categories ?? []) {
      tagCounts.set(cat, (tagCounts.get(cat) ?? 0) + 1);
    }
  }
  return tagCounts;
}

/** Format a date for display */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Gallery item with optional GDrive ID */
interface GalleryItem {
  gdriveId?: string;
  src?: string;
  alt?: string;
  type?: 'image' | 'video';
  width?: number;
  height?: number;
  poster?: string;
  youtubeId?: string;
  display?: string[];
}

/**
 * Resolve the display URL for a gallery item.
 * All media (images + videos) are downloaded at build time by astro-gdrive
 * and served as local static files. Self-healing: every build verifies
 * all files are still accessible on Google Drive.
 */
export function resolveMediaSrc(item: GalleryItem): string {
  if (item.src) {
    // WP-hosted files were downloaded as .jpg/.mp4 and served locally
    if (item.src.includes('whiteport.com/wp-content/')) {
      const filename = item.src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
      const ext = item.type === 'video' ? '.mp4' : '.jpg';
      return `/media/gdrive/wp-${filename}${ext}`;
    }
    return item.src;
  }
  if (item.gdriveId) {
    const ext = item.type === 'video' ? '.mp4' : '.webp';
    return `/media/gdrive/${item.gdriveId}${ext}`;
  }
  // YouTube: use maxres thumbnail as display image
  if (item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`;
  }
  return '';
}

/** Resolve poster/thumbnail URL for a gallery item */
export function resolveMediaPoster(item: GalleryItem): string {
  if (item.poster) {
    if (item.poster.startsWith('http')) return item.poster;
    return `/media/gdrive/${item.poster}.jpg`;
  }
  // Auto-derive poster for videos — pipeline downloads .jpg thumbnail alongside .mp4
  if (item.type === 'video') {
    if (item.gdriveId) return `/media/gdrive/${item.gdriveId}.jpg`;
    if (item.youtubeId) return `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`;
    if (item.src?.includes('whiteport.com/wp-content/')) {
      const filename = item.src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
      return `/media/gdrive/wp-${filename}.jpg`;
    }
  }
  return '';
}
