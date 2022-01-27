import { Base } from './base.model';
// tslint:disable-next-line:class-name
export class _Type extends Base {
  name?: string;
  price?: number;
  session_count?: number;
  // tslint:disable-next-line:no-inferrable-types
  count?: number = 0;
}
