import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Priority, Status, Task } from '../../models/task.model';
import { ProjectMember, Role } from '../../models/project.model';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  const fakeTask: Task = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    status: Status.PENDING,
    priority: Priority.LOW,
    assignedUser: { id: 2, username: 'User1' },
    createdBy: { id: 3, username: 'User2' },
  };

  const fakeUser: ProjectMember = {
    id: 99,
    user: { id: 99, username: 'Admin', email: 'admin@example.com' },
    role: Role.ADMIN,
  };

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'updateTaskStatus',
      'updateTaskPriority',
      'deleteTask',
    ]);
    apiServiceSpy.updateTaskStatus.and.returnValue(of(void 0));
    apiServiceSpy.updateTaskPriority.and.returnValue(of(void 0));
    apiServiceSpy.deleteTask.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    component.task = { ...fakeTask };
    component.user = { ...fakeUser };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task name and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.task-name')?.textContent).toContain(
      'Test Task'
    );
    expect(compiled.querySelector('.task-desc')?.textContent).toContain(
      'Test Description'
    );
  });

  it('should call apiService.updateTaskStatus when status changes', () => {
    component.onStatusChange(Status.COMPLETED);
    expect(mockApiService.updateTaskStatus).toHaveBeenCalledWith(
      1,
      99,
      Status.COMPLETED
    );
  });

  it('should call apiService.updateTaskPriority when priority changes', () => {
    component.onPriorityChange(Priority.HIGH);
    expect(mockApiService.updateTaskPriority).toHaveBeenCalledWith(
      1,
      99,
      Priority.HIGH
    );
  });

  it('should emit taskDeleted when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.taskDeleted, 'emit');
    component.onDelete();
    expect(mockApiService.deleteTask).toHaveBeenCalledWith(1, 99);
    expect(component.taskDeleted.emit).toHaveBeenCalled();
  });

  it('should not emit taskDeleted when delete is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.taskDeleted, 'emit');
    component.onDelete();
    expect(component.taskDeleted.emit).not.toHaveBeenCalled();
  });

  it('canEditStatus should return true for ADMIN', () => {
    expect(component.canEditStatus()).toBeTrue();
  });

  it('canEditPriority should return true for ADMIN', () => {
    expect(component.canEditPriority()).toBeTrue();
  });
});
