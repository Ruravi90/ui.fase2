import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  plans: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadPlans();
  }

  loadPlans() {
    this.loading = true;
    this.http.get<any>(`${environment.urlApi}saas/available-plans`).subscribe({
      next: (data) => {
        this.plans = data?.plans || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }



}
