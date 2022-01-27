import { Base, User, CatPackage, _Type } from '.';
export class ComplementPackage extends Base {
    package_id?: number;
    cat_package?: CatPackage;
    product_id?: number;
    cat_product?: _Type;
    pill_id?: number;
    cat_pill?: _Type;
    count?: number;
}
