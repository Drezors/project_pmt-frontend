import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectSummary } from '../../../models/project.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-projects-list',
  standalone: false,
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent {
  projects: ProjectSummary[] = [];
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getProjectsByUser().subscribe((data) => {
      this.projects = data;
    });
  }

  goToProjectPage(id: number) {
    this.router.navigate(['/projects/' + id], {
      state: { project: this.projects[id] },
    });
  }
}
