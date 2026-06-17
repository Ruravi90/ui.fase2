import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserService, RoleService, PaginateService } from '../../services';
import { User, Role, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';

declare var $: any, iziToast: any;

@Component({
    selector: 'app-user',
    imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
  public users: User[] = [];
  public roles$!: Observable<Role[]>;
  public user: User = new User();
  public isEdit: boolean = false;
  public existUser: boolean = false;
  public paginate: Paginate = new Paginate();
  public filters: any = {
    perPage: 15,
    isPaid: 0
  };

  private usernameChange: Subject<void> = new Subject();
  
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
    $('#modalUser').on('show.bs.modal', function (event: any) {
    });

    $('#modalUser').on('hidden.bs.modal', function (event: any) {
      that.getUsers();
    });

    this.usernameChange.pipe(debounceTime(300)).subscribe(() => {
      this.aS.getExist(this.user.username || '').subscribe((r: any) => {
        this.existUser = r;
      });
    });
  }

  getUsers() {
    this.pS.paginate(this.filters).subscribe((r: any) => {
      this.paginate = r;
      this.users = this.paginate.data;
    });
  }

  pageChanged(event: any){
    this.pS.getForUrl(event.page, this.filters).subscribe((res: any) => {
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
      this.aS.getById(c.id!).subscribe((r: any) => {
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
    }).then((result: any) => {
      if(result.isConfirmed) {
        this.aS.delete(c.id!).subscribe((r: any) => {
          this.getUsers();
          iziToast.show({
            title: 'Registro eliminado'
          });
        });
      }
    });
  }

  save() {
    if (this.isEdit && !this.existUser) {
      this.aS.put(this.user).subscribe((r: any) => {
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
      this.aS.post(this.user).subscribe((r: any) => {
        if (typeof r === 'object' && r !== null) {
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
       },(error: any)=>{
          iziToast.show({
            title: error.msj,
            color: 'red'
          });
       });
    }
  }
}
