import { io, Socket } from 'socket.io-client';
import { store } from './store';
import type { SocketUserTyping, SocketUserStatus, SocketMessage, SocketComment } from '@/types';

let socket: Socket | null = null;

export function connectSocket() {
  const state = store.getState();
  const token = state.auth.accessToken;
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
    withCredentials: true,
  });
  return socket;
}

export function getSocket() {
  return socket;
}

// --- POST EVENTS ---
export function joinPost(postId: string) {
  socket?.emit('join:post', postId);
}
export function leavePost(postId: string) {
  socket?.emit('leave:post', postId);
}
export function emitPostTyping(postId: string, isTyping: boolean) {
  socket?.emit('post:typing', { postId, isTyping });
}
export function listenPostTyping(cb: (data: SocketUserTyping) => void) {
  socket?.on('user:typing', cb);
}

// --- COMMENT EVENTS ---
export function joinComment(commentId: string) {
  socket?.emit('join:comment', commentId);
}
export function leaveComment(commentId: string) {
  socket?.emit('leave:comment', commentId);
}
export function emitCommentTyping(commentId: string, isTyping: boolean) {
  socket?.emit('comment:typing', { commentId, isTyping });
}
export function listenCommentTyping(cb: (data: SocketUserTyping) => void) {
  socket?.on('user:typing', cb);
}

// --- MESSAGE/CONVERSATION EVENTS ---
export function joinConversation(conversationId: string) {
  socket?.emit('join:conversation', { conversationId });
}
export function leaveConversation(conversationId: string) {
  socket?.emit('leave:conversation', { conversationId });
}
export function emitTypingStart(conversationId: string) {
  socket?.emit('typing:start', { conversationId });
}
export function emitTypingStop(conversationId: string) {
  socket?.emit('typing:stop', { conversationId });
}
export function listenMessageTyping(cb: (data: SocketUserTyping) => void) {
  socket?.on('user:typing', cb);
}
export function listenNewMessage(cb: (data: SocketMessage) => void) {
  socket?.on('broadcastNewMessage', cb);
}
export function listenMessageUpdate(cb: (data: SocketMessage) => void) {
  socket?.on('broadcastMessageUpdate', cb);
}
export function listenMessageDelete(
  cb: (data: { conversationId: string; messageId: string; userId: string }) => void,
) {
  socket?.on('broadcastMessageDelete', cb);
}
export function listenMessageReaction(cb: (data: any) => void) {
  socket?.on('broadcastMessageReaction', cb);
}
export function listenMessageRead(cb: (data: any) => void) {
  socket?.on('broadcastMessageRead', cb);
}

// --- CONVERSATION EVENTS ---
export function listenConversationUpdate(cb: (data: any) => void) {
  socket?.on('broadcastConversationUpdate', cb);
}

// --- POST BROADCAST EVENTS ---
export function listenNewPost(cb: (data: any) => void) {
  socket?.on('broadcastNewPost', cb);
}
export function listenPostUpdate(cb: (data: any) => void) {
  socket?.on('broadcastPostUpdate', cb);
}
export function listenPostDelete(cb: (data: any) => void) {
  socket?.on('broadcastPostDelete', cb);
}
export function listenPostLike(cb: (data: any) => void) {
  socket?.on('broadcastPostLike', cb);
}
export function listenPostUnlike(cb: (data: any) => void) {
  socket?.on('broadcastPostUnlike', cb);
}

// --- COMMENT BROADCAST EVENTS ---
export function listenNewComment(cb: (data: any) => void) {
  socket?.on('broadcastNewComment', cb);
}
export function listenCommentUpdate(cb: (data: any) => void) {
  socket?.on('broadcastCommentUpdate', cb);
}
export function listenCommentDelete(cb: (data: any) => void) {
  socket?.on('broadcastCommentDelete', cb);
}
export function listenCommentLike(cb: (data: any) => void) {
  socket?.on('broadcastCommentLike', cb);
}
export function listenCommentUnlike(cb: (data: any) => void) {
  socket?.on('broadcastCommentUnlike', cb);
}

// --- USER EVENTS ---
export function emitUserStatus(status: 'online' | 'away' | 'busy') {
  socket?.emit('user:status', status);
}
export function emitUserActivity(activity: any) {
  socket?.emit('user:activity', activity);
}
export function listenUserStatus(cb: (data: SocketUserStatus) => void) {
  socket?.on('user:status', cb);
}
export function listenUserActivity(cb: (data: any) => void) {
  socket?.on('user:activity', cb);
}

// --- FOLLOW EVENTS ---
export function listenUserFollow(cb: (data: any) => void) {
  socket?.on('broadcastUserFollow', cb);
}

// --- CONNECTED EVENT ---
export function listenConnected(
  cb: (data: { userId: string; username: string; timestamp: string }) => void,
) {
  socket?.on('connected', cb);
}
