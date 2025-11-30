import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMemberModalComponent } from './add-member-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../services/api.service';

describe('AddMemberModalComponent', () => {
  let component: AddMemberModalComponent;
  let fixture: ComponentFixture<AddMemberModalComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getAllUsers',
      'addProjectMember',
    ]);
    apiServiceSpy.getAllUsers.and.returnValue(of([])); 
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', [
      'open',
      'dismissAll',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AddMemberModalComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMemberModalComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    component.projectMembers = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load users on ngOnInit', () => {
    const mockUsers = [{ id: 1, username: 'TestUser' }];
    mockApiService.getAllUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(component.addMemberForm).toBeTruthy();
    expect(mockApiService.getAllUsers).toHaveBeenCalled();
  });

  it('should submit valid form and close modal on success', () => {
    component.projectId = 1;
    component.projectAdminId = 99;
    component.ngOnInit();
    component.addMemberForm.setValue({ userId: 1, role: 'MEMBER' });

    mockApiService.addProjectMember.and.returnValue(of({}));

    component.onSubmit();

    expect(mockApiService.addProjectMember).toHaveBeenCalled();
    expect(component.successForm).toBeTrue();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });

  it('should set errorForm on submission error', () => {
    component.projectId = 1;
    component.projectAdminId = 99;
    component.ngOnInit();
    component.addMemberForm.setValue({ userId: 1, role: 'MEMBER' });

    mockApiService.addProjectMember.and.returnValue(
      throwError(() => ({ error: { message: 'Erreur serveur' } }))
    );

    component.onSubmit();

    expect(component.errorForm).toBe('Erreur serveur');
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.addMemberForm.setValue({ userId: '', role: '' });

    component.onSubmit();

    expect(mockApiService.addProjectMember).not.toHaveBeenCalled();
  });
});
