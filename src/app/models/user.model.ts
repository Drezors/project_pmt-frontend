export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface UserLogged {
  email: string;
  password: string;
}
