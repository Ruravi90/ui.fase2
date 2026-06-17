import { Base, _Type, Client, User, Department, SaleAdditional,Payment } from '.';
export class Sale extends Base {
    department_id?: number;
    department?: Department;
    responsible_id?: number;
    responsible?: User;
    user?: User;
    client_id?: number;
    client?: Client;
    user_id?: number;
    type_sale_id?: number;
    type?: _Type;
    discount?: number;
    // tslint:disable-next-line:no-inferrable-types
    count?: number = 1;
    balance?: number;
    // tslint:disable-next-line:no-inferrable-types
    price?: number = 0;
    // tslint:disable-next-line:no-inferrable-types
    subtotal?: number = 0;
    // tslint:disable-next-line:no-inferrable-types
    total?: number = 0;
    amount?: number;
    subTotal?: number;
    sumSubTotal?: number;
    sumTotal?: number;
    sumCashTotal?: number;
    sumCardTotal?: number;
    primary_id?: number;
    is_paid?: string | boolean;
    is_cute?: string;
    is_cancel?: number;
    // tslint:disable-next-line:no-inferrable-types
    description?: string;
    product_id?: number;
    cat_product?: _Type;
    product_inventory_id?: number;
    service_id?: number;
    cat_service?: _Type;
    package_id?: number;
    cat_package?: _Type;
    pill_id?: number;
    cat_pill?: _Type;
    sales: Sale[] = [];
    additionals: SaleAdditional[] = [];
    payments:Payment[] = [];
}
