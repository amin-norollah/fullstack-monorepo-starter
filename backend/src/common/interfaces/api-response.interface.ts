export interface ApiResponse<T = any> {
  message: string;
  data: T | null;
  error?: {
    code: string;
    details?: any;
  };
}
