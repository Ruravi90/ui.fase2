import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaasService } from '../../../services/saas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans: any[] = [];
  features: any[] = [];
  loading = false;
  showModal = false;

  newPlan = {
    name: '',
    price: 0,
    currency: 'MXN',
    billing_cycle: 'monthly',
    features: [] as number[]
  };

  constructor(private saasService: SaasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    console.log('Solicitando planes...');
    this.saasService.getPlans().subscribe({
      next: (data) => {
        console.log('Respuesta del servidor:', data);
        this.plans = data?.plans || [];
        this.features = data?.features || [];
        this.loading = false;
        console.log('Planes asginados:', this.plans);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar planes:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
      }
    });
  }

  openModal() {
    this.newPlan = { name: '', price: 0, currency: 'MXN', billing_cycle: 'monthly', features: [] };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  toggleFeature(featureId: number, event: any) {
    if (event.target.checked) {
      this.newPlan.features.push(featureId);
    } else {
      this.newPlan.features = this.newPlan.features.filter(id => id !== featureId);
    }
  }

  savePlan() {
    if (!this.newPlan.name || this.newPlan.price < 0) {
      Swal.fire('Atención', 'Datos de plan inválidos', 'warning');
      return;
    }

    this.loading = true;
    this.saasService.createPlan(this.newPlan).subscribe({
      next: (res) => {
        this.loading = false;
        this.closeModal();
        Swal.fire('Éxito', res.message, 'success');
        this.loadPlans();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Error al crear el plan', 'error');
      }
    });
  }
}
