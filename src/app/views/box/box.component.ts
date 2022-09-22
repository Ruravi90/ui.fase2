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

  public options: DatepickerOptions = {
    minYear: 1970, // minimum available and selectable year
    maxYear: Date.now(), // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'LLLL do yyyy', // date format to display in input
    formatTitle: 'LLLL yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
  };

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
