import { Component, OnInit } from '@angular/core';
import { UserService, RoleService, PaginateService } from '../../services';
import { User, Role, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import swal from 'sweetalert2';
import { isObject } from 'util';
import 'rxjs/add/operator/debounceTime';

declare var $: any, iziToast: any;

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
  public users: User[] = [];
  public roles$: Observable<Role[]>;
  public user: User = new User();
  public isEdit: Boolean = false;
  public existUser: Boolean = false;
  public paginate: Paginate = new Paginate();
  public filters: any = {
    perPage: 15,
    isPaid: 0
  };

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
    // generate random values for mainChart
    $('#modalUser').on('show.bs.modal', function (event) {
    });

    $('#modalUser').on('hidden.bs.modal', function (event) {
      that.getUsers();
    });

    this.usernameChange.debounceTime(300).subscribe(() => {
      this.aS.getExist(this.user.username).subscribe((r) => {
        this.existUser = r;
      });
    });
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
    this.usernameChange.next();
  }

  addUser(): void {
    this.isEdit = false;
    this.user = new User();
    $('#modalUser').modal('show');
  }

  editUser(c: User): void {
    this.isEdit = true;
    setTimeout(() => {
      this.aS.getById(c.id).subscribe(r => {
        this.user = r;
        $('#modalUser').modal('show');
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
      this.aS.delete(c.id).subscribe(r => {
        this.getUsers();
        iziToast.show({
          title: 'Registro eliminado'
        });
      });
    });
  }

  save() {
    if (this.isEdit && !this.existUser) {
      this.aS.put(this.user).subscribe(r => {
        if (r === 200) {
          $('#modalUser').modal('hide');
          iziToast.show({
              title: 'Registro actualizado'
          });
        } else {
          iziToast.show({
            message: 'No fue posible actualizar el registro',
              color: 'red'
          });
        }
       });
    } else {
      this.aS.post(this.user).subscribe(r => {
        if (isObject(r)) {
          $('#modalUser').modal('hide');
          iziToast.show({
              message: 'Registro creado'
          });
        } else {
          iziToast.show({
            title: 'No fue posible crear el registro',
            color: 'red'
          });
        }
       },error=>{
          iziToast.show({
            title: error.msj,
            color: 'red'
          });
       });
    }
  }
}
