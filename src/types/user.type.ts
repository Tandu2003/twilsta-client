export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  phone?: string;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
