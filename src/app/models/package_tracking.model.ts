import { Base, User, CatPackage } from '.';
export class PackageTracking extends Base {
  package_id?: number;
  package?: CatPackage;
  user_id?: number;
  user?: User;
  description?: string;
  scheduled_date?: Date | string;
  is_taken: number | Boolean = false;
}
