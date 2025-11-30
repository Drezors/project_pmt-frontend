import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectDetail, ProjectMember, Role } from '../../models/project.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projectId: number = 0;
  memberRole!: Role;
  project!: ProjectDetail;
  user!: ProjectMember;
  editMode = false;
  editableProject = { name: '', description: '' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = parseInt(params['id']);
      this.projectId = id;
    });
  }
  ngOnInit(): void {
    if (this.projectId) {
      this.apiService.getProjectById(this.projectId).subscribe((data) => {
        this.project = data;
        this.editableProject.name = data.name;
        this.editableProject.description = data.description;

        this.user = this.project.members.find(
          (member) => member.user.id === Number(this.authService.userId)
        ) as ProjectMember;

        if (this.user) {
          this.memberRole = this.user.role;
          console.log('Current member role:', this.memberRole);
        } else {
          console.log("L'utilisateur n'est pas membre de ce projet.");
        }
      });
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'MEMBER':
        return 'badge-member';
      case 'VISITOR':
        return 'badge-visitor';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EN ATTENTE':
        return 'status-pending';
      case 'COMPLETE':
        return 'status-completed';
      case 'EN COURS':
        return 'status-in-progress';
      default:
        return '';
    }
  }

  onDeleteMember(userId: number) {
    if (confirm('Voulez-vous vraiment supprimer ce membre ?')) {
      this.apiService
        .deleteProjectMember(
          this.projectId,
          userId,
          Number(this.authService.userId)
        )
        .subscribe({
          next: () => {
            console.log('Membre supprimé !');
            this.refreshProject();
          },
          error: (err) => {
            console.error('Erreur de suppression :', err);
          },
        });
    }
  }

  refreshProject() {
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (data) => {
        this.project = data;
      },
      error: (err) => {
        console.error('Erreur lors du rafraîchissement du projet :', err);
      },
    });
  }

  onUpdateProject(): void {
    this.apiService
      .updateProject(this.projectId, this.user.user.id, this.editableProject)
      .subscribe({
        next: () => {
          console.log('Projet mis à jour');
          this.editMode = false;
          this.refreshProject();
        },
        error: (err) => console.error('Erreur lors de la mise à jour :', err),
      });
  }
}
