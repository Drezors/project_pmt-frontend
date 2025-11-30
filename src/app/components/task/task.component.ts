import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task, Priority, Status } from '../../models/task.model';
import { ProjectMember } from '../../models/project.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() user!: ProjectMember;
  @Output() taskDeleted = new EventEmitter<void>();

  priorities = Object.values(Priority);
  statuses = Object.values(Status);

  constructor(private apiService: ApiService) {}

  canEditStatus(): boolean {
    return (
      this.user.role === 'ADMIN' ||
      this.task.assignedUser?.id === this.user.user.id
    );
  }

  canEditPriority(): boolean {
    return this.user.role === 'ADMIN';
  }

  onStatusChange(value: Status) {
    console.log(this.user);
    this.apiService
      .updateTaskStatus(this.task.id, this.user.id, value)
      .subscribe(() => {
        this.task.status = value;
      });
  }

  onPriorityChange(value: Priority) {
    this.apiService
      .updateTaskPriority(this.task.id, this.user.id, value)
      .subscribe(() => {
        this.task.priority = value;
      });
  }

  onDelete() {
    if (confirm('Supprimer cette tâche ?')) {
      this.apiService.deleteTask(this.task.id, this.user.id).subscribe(() => {
        this.taskDeleted.emit();
      });
    }
  }
}
