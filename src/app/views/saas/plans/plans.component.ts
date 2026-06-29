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
  editingPlanId: number | null = null;

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
    this.editingPlanId = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingPlanId = null;
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
    const request = this.editingPlanId 
      ? this.saasService.updatePlan(this.editingPlanId, this.newPlan)
      : this.saasService.createPlan(this.newPlan);

    request.subscribe({
      next: (res) => {
        this.loading = false;
        this.closeModal();
        Swal.fire('Éxito', res.message, 'success');
        this.loadPlans();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Error al guardar el plan', 'error');
      }
    });
  }

  editPlan(plan: any) {
    this.newPlan = {
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      features: plan.features ? plan.features.map((f: any) => f.id) : []
    };
    this.editingPlanId = plan.id;
    this.showModal = true;
  }

  deletePlan(id: number) {
    Swal.fire({
      title: '¿Eliminar plan?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará el plan de pago. Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonColor: '#bdc3c7',
      confirmButtonColor: '#e85d5d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.saasService.deletePlan(id).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire('¡Eliminado!', 'El plan ha sido eliminado.', 'success');
            this.loadPlans();
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar el plan', 'error');
          }
        });
      }
    });
  }
}
