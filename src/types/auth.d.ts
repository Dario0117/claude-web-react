export interface AuthenticationContext {
  isLoggedIn: boolean;
}

export interface RouterContext {
  authentication: AuthenticationContext;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  user?: User;
}

export interface AuthActions {
  setUser: (user: User) => void;
}
