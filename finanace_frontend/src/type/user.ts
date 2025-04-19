export interface User {
  user_id?: number;
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  role?: string;
  created_at?: Date;
}
export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}
export interface UserResponse {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
  token: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}
