import { Base, Role } from '.';
export class User  extends Base {
    name?: string;
    lastname?: string;
    motherlastname?: string;
    email?: string;
    username?: string;
    password?: string;
    reset_password?: string;
    token?: string;
    initials?: string;
    roles?: Role[] = [];
    fullname = () => `${this.name} ${this.lastname}`;
}
