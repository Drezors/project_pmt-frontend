import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { NewUser, UserLogged } from '../models/user.model';
import { NewProject } from '../models/project.model';
import { CreateTaskRequest, Priority, Status } from '../models/task.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userId: '123',
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post registration', () => {
    const newUser: NewUser = {
      username: 'test',
      email: 'test@test.com',
      password: '123',
    };
    service.postRegistration(newUser).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/users');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should post login', () => {
    const user: UserLogged = { email: 'test@test.com', password: '123' };
    service.postLogin(user).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/users/login');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get all users', () => {
    service.getAllUsers().subscribe();
    const req = httpMock.expectOne('http://localhost:8080/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get connected user', () => {
    service.getConnectedUser().subscribe();
    const req = httpMock.expectOne('http://localhost:8080/users/123');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should post a new project', () => {
    const project: NewProject = {
      name: 'New Project',
      description: 'Description',
    };
    service.postProject(project).subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects' &&
        req.params.has('ownerId')
    );
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get projects by user', () => {
    service.getProjectsByUser().subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects' &&
        req.params.has('memberId')
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create a task', () => {
    const task: CreateTaskRequest = {
      name: 'Task',
      description: 'Desc',
      priority: Priority.LOW,
      assignedProjectMemberId: 1,
    };
    service.createTask(1, 123, task).subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects/1/create-task' &&
        req.params.has('creatorId')
    );
    expect(req.request.method).toBe('POST');
    req.flush(1);
  });

  it('should update task status', () => {
    service.updateTaskStatus(1, 123, Status.PENDING).subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects/tasks/1/status' &&
        req.params.has('memberId')
    );
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should update task priority', () => {
    service.updateTaskPriority(1, 123, Priority.LOW).subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects/tasks/1/priority' &&
        req.params.has('adminId')
    );
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should delete a task', () => {
    service.deleteTask(1, 123).subscribe();
    const req = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:8080/projects/tasks/1/delete' &&
        req.params.has('adminId')
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
