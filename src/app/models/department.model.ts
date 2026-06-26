import { Base, Sale } from '.';
export class Department extends Base {
    name?: string;
    sales?: Sale[] = [];
    sumSubTotal?: number;
    sumTotal?: number;
    sumCashTotal?: number;
    sumCardTotal?: number;
    business_hours_start?: string;
    business_hours_end?: string;
}
