import {
  Component,
  inject,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-project-adder-modal',
  standalone: false,
  templateUrl: './project-adder-modal.component.html',
  styleUrl: './project-adder-modal.component.scss',
})
export class ProjectAdderModalComponent {
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  projectForm: FormGroup;
  errorForm: string = '';
  succesForm: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.projectForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
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
        },
      );
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      console.log('Formulaire invalide');
      this.errorForm = 'Formulaire invalide';
      return;
    }

    const userId = this.authService.userId;
    console.log('User ID:', userId);

    this.apiService.postProject(this.projectForm.value)?.subscribe({
      next: (response) => {
        this.errorForm = '';
        console.log('Project created succesfuly', response);
        this.succesForm = true;
        setTimeout(() => {
          this.modalService.dismissAll();
          this.router.navigate(['/project/' + response]);
        }, 1000);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorForm = 'Échec de la création du compte';
      },
    });
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  get name() {
    return this.projectForm.get('name') as FormControl;
  }
  get description() {
    return this.projectForm.get('description') as FormControl;
  }
  get startDate() {
    return this.projectForm.get('startDate') as FormControl;
  }
  get endDate() {
    return this.projectForm.get('endDate') as FormControl;
  }
}
