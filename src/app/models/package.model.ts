import { Base, Sale, Client, CatPackage, PackageTracking } from '.';
export class Package extends Base {
  sale_id?: number;
  sale?: Sale;
  client_id?: number;
  client?: Client;
  cat_package_id?: number;
  type?: CatPackage;
  is_completed?: string;
  tracking?: PackageTracking[];
}
