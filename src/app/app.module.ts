import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/home/profile/profile.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsListComponent } from './pages/home/projects-list/projects-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ProjectCardComponent } from './pages/home/project-card/project-card.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationsContainerComponent } from './pages/home/notifications-container/notifications-container.component';
import { ProjectAdderModalComponent } from './components/modals/project-adder-modal/project-adder-modal.component';
import { HeaderComponent } from './components/header/header.component';
import { AddMemberModalComponent } from './components/modals/add-member-modal/add-member-modal.component';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskAdderComponent } from './components/task-adder/task-adder.component';
import { TaskComponent } from './components/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProjectComponent,
    ProjectsListComponent,
    NotFoundComponent,
    ProjectCardComponent,
    NotificationsContainerComponent,
    ProjectAdderModalComponent,
    HeaderComponent,
    AddMemberModalComponent,
    TaskAdderComponent,
    TaskComponent,
  ],
  imports: [
    BrowserModule,
    // NgModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
