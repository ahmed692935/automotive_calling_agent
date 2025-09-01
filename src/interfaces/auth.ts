export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  user?: string;
  id: number;
  username: string;
  email: string;
  token: string; // keep this if backend returns `token`
  access_token?: string; // optional if some APIs return `access_token`
}

export interface AuthState {
  token: string | null; // global token for API calls
  user: User | null; // can be null after logout
  loading: boolean;
  error: string | null;
}
