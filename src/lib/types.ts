export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  };
}

export interface WPCategory {
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage: { node: WPImage } | null;
  categories: { nodes: WPCategory[] };
  tags?: { nodes: WPCategory[] };
}


export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

