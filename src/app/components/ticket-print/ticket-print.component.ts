import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-print.component.html'
})
export class TicketPrintComponent {
  @Input() printPayment: any = null;
  @Input() printSale: any = null;
  @Input() cuteSales: any[] | null = null;
  @Input() dateNow: Date | string = new Date();
}
