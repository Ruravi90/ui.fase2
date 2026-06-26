import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SaasService } from '../../../services/saas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscriptions: any[] = [];
  loading = false;

  constructor(private saasService: SaasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    this.saasService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudieron cargar las suscripciones', 'error');
      }
    });
  }
}
