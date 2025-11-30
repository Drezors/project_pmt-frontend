import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/home/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProjectComponent } from './pages/project/project.component';

import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NotificationsContainerComponent } from './pages/home/notifications-container/notifications-container.component';
import { ProjectsListComponent } from './pages/home/projects-list/projects-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      { path: 'main', component: ProjectsListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationsContainerComponent },
    ],
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { message: 'La page est introuvale' },
  },
  {
    path: '**',
    redirectTo: '/not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
