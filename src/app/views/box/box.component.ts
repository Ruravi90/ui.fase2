import { Component, OnInit } from '@angular/core';
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
  public filters: any = { date: new Date().toISOString().split('T')[0] };
  public balances: Balance[] = [];
  public currentUser: User;

  constructor(private bS: BalanceService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.getBalance();
  }
  getBalance() {
    this.bS.get(this.filters).subscribe((r: Balance[]) => {
      this.balances = r;
    });
  }
}
