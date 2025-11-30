import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, NewUser, UserLogged } from '../models/user.model';
import { Observable } from 'rxjs';
import {
  AddMember,
  NewProject,
  ProjectDetail,
  ProjectSummary,
} from '../models/project.model';
import { AuthService } from './auth.service';
import { CreateTaskRequest, Priority, Status } from '../models/task.model';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiRoute: string = 'http://localhost:8080/';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  // ✅ User
  postRegistration(user: NewUser): Observable<any> {
    return this.httpClient.post(this.apiRoute + 'users', user);
  }

  postLogin(user: UserLogged): Observable<any> {
    return this.httpClient.post(this.apiRoute + 'users/login', user);
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiRoute}users`);
  }

  getConnectedUser(): Observable<User> {
    const userId = this.authService.userId;
    if (!userId) {
      throw new Error('User not connected');
    }

    return this.httpClient.get<User>(`${this.apiRoute}users/${userId}`);
  }

  // ✅ Create project
  postProject(newProject: NewProject): Observable<any> {
    const params = new HttpParams().set(
      'ownerId',
      this.authService.userId || ''
    );

    return this.httpClient.post(this.apiRoute + 'projects', newProject, {
      params,
    });
  }

  // ✅ Get all projects for a user (via ProjectMember)
  getProjectsByUser(): Observable<ProjectSummary[]> {
    const params = new HttpParams().set(
      'memberId',
      this.authService.userId || ''
    );

    return this.httpClient.get<ProjectSummary[]>(this.apiRoute + 'projects', {
      params,
    });
  }

  // ✅ Get project details
  getProjectById(projectId: number): Observable<ProjectDetail> {
    const params = new HttpParams().set(
      'userId',
      this.authService.userId || ''
    );

    return this.httpClient.get<ProjectDetail>(
      `${this.apiRoute}projects/${projectId}`,
      { params }
    );
  }

  updateProject(
    projectId: number,
    adminId: number,
    updatedData: { name?: string; description?: string }
  ): Observable<void> {
    const params = new HttpParams().set('adminId', adminId.toString());

    return this.httpClient.put<void>(
      `${this.apiRoute}projects/${projectId}/update`,
      updatedData,
      { params }
    );
  }

  addProjectMember(addMember: AddMember): Observable<any> {
    const params = new HttpParams().set(
      'projectAdminId',
      addMember.projectAdminId.toString()
    );

    const payload = {
      userId: addMember.userId,
      role: addMember.role,
    };

    return this.httpClient.post(
      `${this.apiRoute}projects/${addMember.projectId}`,
      payload,
      { params }
    );
  }

  deleteProjectMember(
    projectId: number,
    userId: number,
    deleterId: number
  ): Observable<any> {
    const params = new HttpParams().set('deleterId', deleterId.toString());

    console.log(projectId, userId, deleterId);

    return this.httpClient.delete(
      `${this.apiRoute}projects/${projectId}/members/${userId}`,
      { params }
    );
  }

  /// task

  /** ✅ Créer une tâche dans un projet */
  createTask(
    projectId: number,
    creatorId: number,
    task: CreateTaskRequest
  ): Observable<number> {
    const params = new HttpParams().set('creatorId', creatorId.toString());
    return this.httpClient.post<number>(
      `${this.apiRoute}projects/${projectId}/create-task`,
      task,
      { params }
    );
  }

  /** ✅ Modifier le statut */
  updateTaskStatus(
    taskId: number,
    projectMemberId: number,
    status: Status
  ): Observable<void> {
    const params = new HttpParams().set('memberId', projectMemberId.toString());

    return this.httpClient.patch<void>(
      `${this.apiRoute}projects/tasks/${taskId}/status`,
      JSON.stringify(status), // NE PAS faire de JSON.stringify
      { params, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /** ✅ Modifier la priorité */
  updateTaskPriority(
    taskId: number,
    adminId: number,
    priority: Priority
  ): Observable<void> {
    const params = new HttpParams().set('adminId', adminId.toString());

    return this.httpClient.patch<void>(
      `${this.apiRoute}projects/tasks/${taskId}/priority`,
      JSON.stringify(priority), // NE PAS faire de JSON.stringify
      { params, headers: { 'Content-Type': 'application/json' } }
    );
  }

  /** ✅ Supprimer une tâche (admin only) */
  deleteTask(taskId: number, adminId: number): Observable<void> {
    const params = new HttpParams().set('adminId', adminId.toString());

    return this.httpClient.delete<void>(
      `${this.apiRoute}projects/tasks/${taskId}/delete`,
      { params }
    );
  }

  /// Notification

  getNotifications(): Observable<Notification[]> {
    const userId = this.authService.userId;
    return this.httpClient.get<Notification[]>(
      `${this.apiRoute}notifications/${userId}`
    );
  }

  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.httpClient.patch<void>(
      `${this.apiRoute}notifications/${notificationId}/read`,
      {}
    );
  }

  markAllNotificationsAsRead(): Observable<void> {
    const userId = this.authService.userId;
    return this.httpClient.patch<void>(
      `${this.apiRoute}notifications/read-all/${userId}`,
      {}
    );
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiRoute}notifications/${notificationId}`
    );
  }
}
