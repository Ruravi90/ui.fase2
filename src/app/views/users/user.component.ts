import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, RoleService, PaginateService } from '../../services';
import { User, Role, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
  private timeout?: number;
  public users: User[] = [];
  public roles$: Observable<Role[]> = new Observable<Role[]>();
  public user: User = new User();
  public isEdit: Boolean = false;
  public existUser: Boolean = false;
  public paginate: Paginate = new Paginate();
  @ViewChild('modalUser', { static: false }) modalUser?: ModalDirective;
  public filters: any = {
    perPage: 15,
    isPaid: 0
  };

  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  private usernameChange: Subject<string> = new Subject();

  constructor(
    private aS: UserService,
    private rS: RoleService,
    private pS: PaginateService) {
      this.pS.model = 'users';
  }


  ngOnInit() {
    this.roles$ =  this.rS.get();
    const that = this;
    that.getUsers();

  }

  getUsers() {
    this.pS.paginate(this.filters).subscribe((r) => {
      this.paginate = r;
      this.users = this.paginate.data;
    });
  }

  pageChanged(event: any){
    this.pS.getForUrl(event.page, this.filters).subscribe(res => {
      this.paginate = res;
      this.users = this.paginate.data;
    });
  }

  onExistUser() {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.aS.getExist(this.user.username!).subscribe((r) => {
        this.existUser = r;
      });
    } , 300);
  }

  addUser(): void {
    this.isEdit = false;
    this.user = new User();
    this.modalUser?.show();
  }

  editUser(c: User): void {
    this.isEdit = true;
    setTimeout(() => {
      this.aS.getById(c.id!).subscribe(r => {
        this.user = r;
        this.modalUser?.show();
      });
    }, 300);
  }

  async deleteUser(c: User) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if(result.isConfirmed){
        this.aS.delete(c.id!).subscribe(r => {
          this.getUsers();
          this.toast.fire({
            icon: 'success',
            title: 'Registro eliminado'
          });
        });
      }
    });
  }

  save() {
    if (this.isEdit && !this.existUser) {
      this.aS.put(this.user).subscribe(r => {
        if (r === 200) {
          this.modalUser?.hide();
          this.toast.fire({
            icon: 'success',
              title: 'Registro actualizado'
          });
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'No fue posible actualizar el registro',
          });
        }
       });
    } else {
      this.aS.post(this.user).subscribe(r => {
        if (r != null) {
          this.modalUser?.hide();
          this.toast.fire({
            icon: 'success',
            title: 'Registro creado'
          });
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'No fue posible crear el registro',
          });
        }
       },error=>{
        this.toast.fire({
            icon: 'error',
            title: error.msj,
          });
       });
    }
  }
}
