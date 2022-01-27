import { _Type, Sale, Inventory } from '.';
export class SaleAdditional extends _Type {
    sale_id?: number;
    sale?: Sale;
    product_id?: number;
    cat_product?: _Type;
    pill_id?: number;
    cat_pill?: _Type;
    inventory?: Inventory[];
  }

