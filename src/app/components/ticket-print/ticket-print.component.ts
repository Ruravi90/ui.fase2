import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() clinicName: string = '';

  get displayName(): string {
    if (this.clinicName) return this.clinicName;
    // Try to get from sale department
    const dept = this.printSale?.department?.name
      || this.printPayment?.sale?.department?.name;
    return dept || '';
  }
}
