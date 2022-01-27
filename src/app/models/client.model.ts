import {Address, _Type} from '.';
export class Client {

    id?: number;
    name?: string;
    lastname?: string;
    motherlastname?: string;
    fullname?: string;
    email?: string;
    phone_home?: string;
    phone_mobile?: string;
    reference_id?: number;
    reference?: _Type;
    other_ref?: string;
    address?: Address[] = [new Address()];

    public _setFullName(){
      this.fullname =  this.name + ' ' + this.lastname + ' ' + (this.motherlastname ? this.motherlastname:'' );
    };
}
