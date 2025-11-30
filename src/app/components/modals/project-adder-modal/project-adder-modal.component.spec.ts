import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProjectAdderModalComponent } from './project-adder-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProjectAdderModalComponent', () => {
  let component: ProjectAdderModalComponent;
  let fixture: ComponentFixture<ProjectAdderModalComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['postProject']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', [
      'open',
      'dismissAll',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProjectAdderModalComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAdderModalComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.projectForm).toBeTruthy();
    expect(component.projectForm.contains('name')).toBeTrue();
    expect(component.projectForm.contains('description')).toBeTrue();
    expect(component.projectForm.contains('startDate')).toBeTrue();
    expect(component.projectForm.contains('endDate')).toBeTrue();
  });

  it('should submit valid form and close modal on success', fakeAsync(() => {
    const formValue = {
      name: 'Project 1',
      description: 'Desc',
      startDate: '2025-05-12',
      endDate: '2025-05-13',
    };
    component.projectForm.setValue(formValue);
    mockApiService.postProject.and.returnValue(of(123)); // Simule un ID de projet

    component.onSubmit();

    expect(mockApiService.postProject).toHaveBeenCalledWith(formValue);

    tick(1000); // Simule le setTimeout

    expect(component.succesForm).toBeTrue();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/project/123']);
  }));

  it('should set errorForm on submission error', () => {
    const formValue = {
      name: 'Project 1',
      description: 'Desc',
      startDate: '2025-05-12',
      endDate: '2025-05-13',
    };
    component.projectForm.setValue(formValue);
    mockApiService.postProject.and.returnValue(
      throwError(() => ({ error: { message: 'Erreur serveur' } }))
    );

    component.onSubmit();

    expect(['Erreur serveur', 'Échec de la création du compte']).toContain(
      component.errorForm
    );
  });

  it('should not submit if form is invalid', () => {
    component.projectForm.setValue({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });

    component.onSubmit();

    expect(mockApiService.postProject).not.toHaveBeenCalled();
  });
});
