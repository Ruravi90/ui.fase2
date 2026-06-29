import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaasService } from '../../../services/saas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {
  tenants: any[] = [];
  availablePlans: any[] = [];
  loading = false;
  
  showModal = false;
  isEditing = false;
  editingId: string | null = null;
  newTenant = {
    name: '', domain: '', admin_name: '', admin_username: '', admin_email: '', admin_password: ''
  };

  showAssignModal = false;
  assignData = {
    tenantId: '',
    planId: 0,
    months: 1
  };

  constructor(private saasService: SaasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTenants();
    this.loadPlans();
  }

  loadTenants() {
    this.loading = true;
    this.saasService.getTenants().subscribe({
      next: (data) => {
        this.tenants = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudieron cargar las clínicas', 'error');
      }
    });
  }

  loadPlans() {
    this.saasService.getPlans().subscribe({
      next: (res) => {
        this.availablePlans = res.plans || [];
      }
    });
  }

  openModal() {
    this.isEditing = false;
    this.editingId = null;
    this.newTenant = { name: '', domain: '', admin_name: '', admin_username: '', admin_email: '', admin_password: '' };
    this.showModal = true;
  }

  editTenant(tenant: any) {
    this.isEditing = true;
    this.editingId = tenant.id;
    // Llenamos el form con los datos actuales (los del admin no aplican para editar por aquí por seguridad)
    this.newTenant = {
      name: tenant.name,
      domain: tenant.domain,
      admin_name: '', admin_username: '', admin_email: '', admin_password: ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveTenant() {
    if (!this.newTenant.name) {
      Swal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }
    
    if (!this.isEditing && (!this.newTenant.admin_email || !this.newTenant.admin_password)) {
      Swal.fire('Atención', 'Faltan datos del administrador', 'warning');
      return;
    }

    this.loading = true;
    
    if (this.isEditing && this.editingId) {
      this.saasService.updateTenant(this.editingId, { name: this.newTenant.name, domain: this.newTenant.domain }).subscribe({
        next: (res) => {
          this.loading = false;
          this.closeModal();
          Swal.fire('Éxito', res.message, 'success');
          this.loadTenants();
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', 'Error al actualizar clínica', 'error');
        }
      });
    } else {
      this.saasService.createTenant(this.newTenant).subscribe({
        next: (res) => {
          this.loading = false;
          this.closeModal();
          Swal.fire('Éxito', res.message, 'success');
          this.loadTenants();
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.message || err.error?.error || 'Error al crear la clínica';
          Swal.fire('Error', msg, 'error');
        }
      });
    }
  }

  deleteTenant(id: string) {
    Swal.fire({
      title: '¿Eliminar clínica?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará esta clínica del sistema. Esta acción no se puede deshacer.</p>`,
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
        this.saasService.deleteTenant(id).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire('Eliminado', 'La clínica fue borrada.', 'success');
            this.loadTenants();
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar la clínica', 'error');
          }
        });
      }
    });
  }

  openAssignModal(tenantId: string) {
    this.assignData = { tenantId, planId: 0, months: 1 };
    
    // Find the tenant to pre-fill the form
    const tenant = this.tenants.find(t => t.id === tenantId);
    
    if (tenant && tenant.subscription) {
        this.assignData.planId = tenant.subscription.plan_id;
        
        // Calculate months if ends_at exists
        if (tenant.subscription.starts_at && tenant.subscription.ends_at) {
            const start = new Date(tenant.subscription.starts_at);
            const end = new Date(tenant.subscription.ends_at);
            const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            this.assignData.months = diffMonths > 0 ? diffMonths : 1;
        }
    } else if (this.availablePlans.length > 0) {
        this.assignData.planId = this.availablePlans[0].id;
    }
    
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
  }

  confirmAssignPlan() {
    if (!this.assignData.planId || this.assignData.months < 1) {
      Swal.fire('Atención', 'Selecciona un plan y un periodo válido', 'warning');
      return;
    }
    this.loading = true;
    this.saasService.assignManualPlan(this.assignData.tenantId, this.assignData.planId, this.assignData.months).subscribe({
      next: (res) => {
        this.loading = false;
        this.closeAssignModal();
        this.cdr.detectChanges();
        Swal.fire('Éxito', 'Plan asignado correctamente', 'success');
        this.loadTenants();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', 'No se pudo asignar el plan', 'error');
      }
    });
  }
}
