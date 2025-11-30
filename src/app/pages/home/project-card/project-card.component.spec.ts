import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProjectCardComponent } from './project-card.component';
import { ProjectSummary } from '../../../models/project.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProject: ProjectSummary = {
    projectId: 1,
    projectName: 'Test Project',
    projectDescription: 'Description of the project',
    role: 'ADMIN',
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProjectCardComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.project = mockProject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain(
      'Test Project'
    );
    expect(compiled.querySelector('.card-text')?.textContent).toContain(
      'Description of the project'
    );
    expect(compiled.querySelector('.card-text strong')?.textContent).toContain(
      'Role:'
    );
  });

  it('should navigate to project on click', () => {
    component.goToProject();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/project', 1]);
  });
});
