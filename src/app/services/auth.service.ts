import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userId: string | null = localStorage.getItem('userId');

  constructor() {}

  public get isLoggedIn(): boolean {
    return this._userId !== null;
  }

  public get userId(): string | null {
    return this._userId;
  }

  login(userId: string): void {
    this._userId = userId;
    localStorage.setItem('userId', userId);
  }

  logout(): void {
    this._userId = null;
    localStorage.removeItem('userId');
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(this._userId !== null);
      }, 100);
    });
  }
}
