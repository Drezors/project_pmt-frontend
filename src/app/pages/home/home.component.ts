import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';

export interface Tab {
  name: string;
  path: string;
}

@Component({
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tabs: Tab[] = [
    { name: 'Projects', path: '/main' },
    { name: 'Profile', path: '/profile' },
    { name: 'Notifications', path: '/notifications' },
  ];

  currentUserConnected!: User;

  constructor(
    public authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getConnectedUser().subscribe({
      next: (data) => {
        try {
          this.currentUserConnected = data;
          console.log('Current User:', this.currentUserConnected);
        } catch (error) {
          console.error('Invalid JSON format:', error);
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
