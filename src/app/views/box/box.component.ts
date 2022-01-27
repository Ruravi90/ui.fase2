import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../services';
import { Balance } from '../../models';
import * as esLocale from 'date-fns/locale/es';

import swal from 'sweetalert2';
import { DatepickerOptions } from 'ng2-datepicker';
declare var $: any, iziToast: any;

@Component({
  templateUrl: 'box.component.html',
  styleUrls: ['box.component.css']
})
export class BoxComponent implements OnInit {
  public balances: Balance[];
  public filters:any = {};

  public options: DatepickerOptions = {
    minYear: 1970,
    maxDate: new Date(Date.now()),
    displayFormat: 'MMMM',
    barTitleFormat: 'MMMM',
    dayNamesFormat: 'DD',
    locale: esLocale,
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    barTitleIfEmpty: 'Selecciona el mes',
    placeholder: 'Seleccionar el mes', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
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
