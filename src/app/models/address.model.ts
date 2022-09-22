import { Base } from './base.model';

export class Address extends Base {
    suburb?: string;
    name?: string;
    inner_number?: number;
    outdoor_number?: number;
    postal_code?: number;
    town?: string;
    state?: string;
    client_id?: number;
    provider_id?: number;
    creditor_id?: number;
}
