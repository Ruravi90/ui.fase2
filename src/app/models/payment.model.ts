import { Base, Sale, User, _Type } from '.';
export class Payment  extends Base {
  sale_id?: number;
  sale?: Sale;
  user_id?: number;
  user?: User;
  responsible_id?: number;
  responsible?: User;
  type_sale_id?: number;
  type?: _Type;
  amount?: number;
  is_paid?: string | boolean;
}
