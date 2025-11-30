import { Component, Input } from '@angular/core';
import { ProjectSummary } from '../../../models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input() project!: ProjectSummary;

  constructor(private router: Router) {}

  goToProject() {
    this.router.navigate(['/project', this.project.projectId]);
  }
}
