import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BalanceService } from '../../services';
import { User, Balance } from '../../models';

import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-box',
    imports: [CommonModule, FormsModule],
    templateUrl: 'box.component.html',
    styleUrls: ['box.component.css']
})
export class BoxComponent implements OnInit {
  public filters: any = { date: new Date().toISOString().slice(0, 7) };
  public balances: Balance[] = [];
  public currentUser: User;

  constructor(private bS: BalanceService, private cdr: ChangeDetectorRef) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.getBalance();
  }
  
  isLoading = true;
  getBalance() {
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.bS.get(this.filters).subscribe((r: Balance[]) => {
      console.log('Balance response:', r);
      this.balances = r;
      this.isLoading = false;
      this.cdr.detectChanges();
    }, (error) => {
      console.error('Error loading balances', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
}
