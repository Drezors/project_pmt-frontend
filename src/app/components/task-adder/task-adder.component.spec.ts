import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TaskAdderComponent } from './task-adder.component';
import { ApiService } from '../../services/api.service';
import { ProjectMember, Role } from '../../models/project.model';
import { Priority } from '../../models/task.model';

describe('TaskAdderComponent', () => {
  let component: TaskAdderComponent;
  let fixture: ComponentFixture<TaskAdderComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const fakeUser: ProjectMember = {
    id: 1,
    role: Role.ADMIN,
    user: { id: 1, username: 'admin', email: 'admin@test.com' },
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['createTask']);
    await TestBed.configureTestingModule({
      declarations: [TaskAdderComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAdderComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    component.projectId = 1;
    component.user = fakeUser;
    component.members = [fakeUser];

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle form visibility', () => {
    expect(component.isAdding).toBeFalse();
    component.toggleForm();
    expect(component.isAdding).toBeTrue();
  });

  it('should not submit if the form is invalid', () => {
    spyOn(console, 'log');
    component.taskForm.setValue({
      name: '',
      description: '',
      priority: Priority.MEDIUM,
      assignedProjectMemberId: '',
    });
    component.onSubmit();
    expect(apiServiceSpy.createTask).not.toHaveBeenCalled();
  });

  it('should call createTask and reset the form on successful submission', () => {
    component.taskForm.setValue({
      name: 'Test Task',
      description: 'Test Description',
      priority: Priority.HIGH,
      assignedProjectMemberId: 1,
    });

    apiServiceSpy.createTask.and.returnValue(of(123));
    spyOn(component.taskCreated, 'emit');

    component.onSubmit();

    expect(apiServiceSpy.createTask).toHaveBeenCalledWith(1, 1, {
      name: 'Test Task',
      description: 'Test Description',
      priority: Priority.HIGH,
      assignedProjectMemberId: 1,
    });
    expect(component.taskForm.value.name).toBeNull(); // Reset sets null, not ''
    expect(component.taskCreated.emit).toHaveBeenCalled();
    expect(component.isAdding).toBeFalse();
  });
});
