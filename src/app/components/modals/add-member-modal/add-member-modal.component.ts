import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { ProjectMember } from '../../../models/project.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-add-member-modal',
  standalone: false,
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
})
export class AddMemberModalComponent {
  private modalService = inject(NgbModal);

  @Input() projectId!: number;
  @Input() projectAdminId!: number;
  @Input() projectMembers: ProjectMember[] = [];
  @Output() memberAdded = new EventEmitter<void>();

  closeResult: WritableSignal<string> = signal('');
  addMemberForm!: FormGroup;
  availableUsers: User[] = [];
  errorForm: string = '';
  successForm: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.addMemberForm = new FormGroup({
      userId: new FormControl('', Validators.required),
      role: new FormControl('MEMBER', Validators.required),
    });

    this.apiService.getAllUsers().subscribe((users) => {
      this.availableUsers = users.filter(
        (user: User) =>
          !this.projectMembers.some((member) => member.user.id === user.id)
      );
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult.set(`Closed with: ${result}`);
        },
        (reason) => {
          this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case 'ESC':
        return 'by pressing ESC';
      case 'BACKDROP_CLICK':
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  onSubmit() {
    if (this.addMemberForm.valid) {
      const payload = {
        projectId: this.projectId,
        projectAdminId: this.projectAdminId,
        userId: this.addMemberForm.value.userId,
        role: this.addMemberForm.value.role,
      };

      this.apiService.addProjectMember(payload).subscribe({
        next: () => {
          this.successForm = true;
          this.modalService.dismissAll();
          this.memberAdded.emit(); // ✅ Émission de l'événement
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorForm = err.error.message || 'Une erreur est survenue';
        },
      });
    }
  }

  get userId() {
    return this.addMemberForm.get('userId') as FormControl;
  }

  get role() {
    return this.addMemberForm.get('role') as FormControl;
  }
}
