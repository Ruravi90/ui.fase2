import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../services';
import { Balance } from '../../models';
import locale from 'date-fns/locale/en-US';
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  templateUrl: 'box.component.html',
  styleUrls: ['box.component.css']
})
export class BoxComponent implements OnInit {
  public balances: Balance[] | undefined;
  public filters:any = {};

  constructor(private bS: BalanceService) {
    this.filters.date = new Date(Date.now());
  }

  ngOnInit(): void {
    this.getBalance();
  }
  getBalance() {
    this.bS.get(this.filters).subscribe(r => {
      this.balances = r;
    });
  }
}
