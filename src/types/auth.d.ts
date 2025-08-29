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
  isLoggedIn: boolean;
  wasProfileChecked: boolean;
  user?: User;
}

export interface AuthActions {
  logIn: () => void;
  logOut: () => void;
  checkProfile: () => void;
  setUser: (user: User) => void;
}
