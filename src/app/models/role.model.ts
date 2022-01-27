import { Base, Permission } from '.';
export class Role  extends Base {
    name?: string;
    slug?: string;
    description?: string;
    permissions?: Permission[];
}
