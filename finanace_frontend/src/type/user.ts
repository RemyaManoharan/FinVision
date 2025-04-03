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
    full_name: string;
    email: string;
    password: string;
    phone: string;
  }