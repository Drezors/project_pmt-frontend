import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Priority, CreateTaskRequest } from '../../models/task.model';
import { ProjectMember } from '../../models/project.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-adder',
  standalone: false,
  templateUrl: './task-adder.component.html',
  styleUrl: './task-adder.component.scss',
})
export class TaskAdderComponent {
  @Input() projectId!: number;
  @Input() members: ProjectMember[] = [];
  @Output() taskCreated = new EventEmitter<void>();
  @Input() user!: ProjectMember;

  isAdding: boolean = false;

  taskForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl('MEDIUM', Validators.required),
    assignedProjectMemberId: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService) {}

  toggleForm(): void {
    this.isAdding = !this.isAdding;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    console.log(this.user);
    const creatorId = this.user?.user?.id;
    this.apiService
      .createTask(this.projectId, creatorId, this.taskForm.value)
      .subscribe({
        next: () => {
          this.taskForm.reset({ priority: 'MEDIUM' });
          this.taskCreated.emit();
          this.isAdding = false;
        },
        error: (err) =>
          console.error('Erreur lors de la création de la tâche', err),
      });
  }
}
