// Các type, enum, interface, DTO, socket event... dựa trên contract server

// 1. API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// 2. Enums
export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  REPOST = 'REPOST',
  MENTION = 'MENTION',
  MESSAGE = 'MESSAGE',
}
export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}
export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  MIXED = 'MIXED',
}
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  STICKER = 'STICKER',
  GIF = 'GIF',
  LOCATION = 'LOCATION',
}
export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}
export enum ParticipantRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

// 3. Entity
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  location?: string;
  verified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}
export interface Post {
  id: string;
  content?: string;
  type: PostType;
  images: string[];
  videos: string[];
  audioUrl?: string;
  authorId: string;
  parentId?: string;
  replyToId?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  viewsCount: number;
  isPublic: boolean;
  allowReplies: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}
export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId?: string;
  images: string[];
  videos: string[];
  audioUrl?: string;
  documents: string[];
  depth: number;
  path?: string;
  repliesCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
export interface Message {
  id: string;
  content?: string;
  type: MessageType;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  mediaDuration?: number;
  thumbnailUrl?: string;
  isEdited: boolean;
  editedAt?: string;
  replyToId?: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  replyTo?: Message;
}
export interface Conversation {
  id: string;
  name?: string;
  type: ConversationType;
  isGroup: boolean;
  avatar?: string;
  description?: string;
  isArchived: boolean;
  isMuted: boolean;
  muteUntil?: string;
  onlyAdminsCanMessage: boolean;
  allowMemberAdd: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageId?: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
  lastMessageSender?: string;
}

// 4. DTOs
export interface LoginRequest {
  login: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  accessToken: string;
}

// 5. Socket Event Types
export interface SocketUserTyping {
  userId: string;
  username: string;
  conversationId?: string;
  commentId?: string;
  isTyping: boolean;
  timestamp: string;
}
export interface SocketUserStatus {
  userId: string;
  status: 'online' | 'away' | 'busy';
}
export interface SocketMessage {
  conversationId: string;
  message: Message;
}
export interface SocketComment {
  commentId: string;
  comment: Comment;
}
// ... Có thể mở rộng thêm các type event khác khi cần
