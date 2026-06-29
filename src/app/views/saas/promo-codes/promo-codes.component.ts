import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoCodeService } from '../../../services/saas/promo-code.service';
import { PromoCode } from '../../../models/saas/promo-code';
// Suponemos que existe un PlanService o podemos traerlo
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-promo-codes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promo-codes.component.html',
  styleUrls: ['./promo-codes.component.scss']
})
export class PromoCodesComponent implements OnInit {
  promoCodes: PromoCode[] = [];
  plans: any[] = [];
  loading = false;

  showModal = false;
  editingCodeId: number | null = null;
  newCode: PromoCode = {
    code: '',
    percentage: 0,
    is_active: true,
    expires_at: '',
    plan_ids: []
  };

  constructor(
    private promoCodeService: PromoCodeService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPromoCodes();
    this.loadPlans();
  }

  loadPromoCodes() {
    this.loading = true;
    this.promoCodeService.getPromoCodes().subscribe({
      next: (data) => {
        this.promoCodes = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPlans() {
    this.http.get<any>(`${environment.urlApi}saas/plans`).subscribe({
      next: (data) => {
        this.plans = data?.plans || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  openModal(code?: PromoCode) {
    if (code) {
      this.editingCodeId = code.id!;
      // Format date for input type="date"
      let formattedDate = code.expires_at;
      if (formattedDate && formattedDate.length > 10) {
        formattedDate = formattedDate.substring(0, 10);
      }
      this.newCode = {
        ...code,
        expires_at: formattedDate,
        plan_ids: code.plans ? code.plans.map(p => p.id) : []
      };
    } else {
      this.editingCodeId = null;
      this.newCode = {
        code: '',
        percentage: 0,
        is_active: true,
        expires_at: '',
        plan_ids: []
      };
    }
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  togglePlan(planId: number, event: any) {
    if (!this.newCode.plan_ids) this.newCode.plan_ids = [];
    if (event.target.checked) {
      this.newCode.plan_ids.push(planId);
    } else {
      this.newCode.plan_ids = this.newCode.plan_ids.filter(id => id !== planId);
    }
  }

  saveCode() {
    this.loading = true;
    if (this.editingCodeId) {
      this.promoCodeService.updatePromoCode(this.editingCodeId, this.newCode).subscribe({
        next: () => {
          this.loadPromoCodes();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.promoCodeService.createPromoCode(this.newCode).subscribe({
        next: () => {
          this.loadPromoCodes();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteCode(id: number) {
    if (confirm('¿Estás seguro de eliminar este código?')) {
      this.promoCodeService.deletePromoCode(id).subscribe(() => {
        this.loadPromoCodes();
      });
    }
  }
}
