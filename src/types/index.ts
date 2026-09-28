export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
  bio?: string;
  isCloseFriend?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
