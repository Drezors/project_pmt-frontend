import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  message: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.message = this.activatedRoute.snapshot.data['messages'];
  }
}
