export * from './user.type';
export * from './auth.type';

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}
