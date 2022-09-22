import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../services';


@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private bS:BalanceService) {

  }
  ngOnInit(): void {

  }
}
