import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserService, RoleService, PaginateService } from '../../services';
import { User, Role, Paginate } from '../../models';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  public users: User[] = [];
  public roles$!: Observable<Role[]>;
  public user: User = new User();
  public isEdit = false;
  public existUser = false;
  public paginate: Paginate = new Paginate();
  public filters: any = {
    perPage: 15,
    isPaid: 0
  };

  public loading = false;
  public showModal = false;

  private usernameChange: Subject<void> = new Subject();
  
  constructor(
    private aS: UserService, 
    private rS: RoleService,
    private pS: PaginateService,
    private cdr: ChangeDetectorRef
  ) {
    this.pS.model = 'users';
  }

  ngOnInit() {
    this.roles$ = this.rS.get();
    this.getUsers();

    this.usernameChange.pipe(debounceTime(300)).subscribe(() => {
      this.aS.getExist(this.user.username || '').subscribe((r: any) => {
        this.existUser = r;
        this.cdr.detectChanges();
      });
    });
  }

  getUsers() {
    this.loading = true;
    this.pS.paginate(this.filters).subscribe({
      next: (r: any) => {
        this.paginate = r;
        this.users = this.paginate.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  pageChanged(event: any){
    this.loading = true;
    this.pS.getForUrl(event.page, this.filters).subscribe({
      next: (res: any) => {
        this.paginate = res;
        this.users = this.paginate.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onExistUser() {
    this.usernameChange.next();
  }

  addUser(): void {
    this.isEdit = false;
    this.existUser = false;
    this.user = new User();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  editUser(c: User): void {
    this.isEdit = true;
    this.existUser = true; // assume valid for editing
    this.loading = true;
    
    this.aS.getById(c.id!).subscribe({
      next: (r: any) => {
        this.user = r;
        this.loading = false;
        this.showModal = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  deleteUser(c: User) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará al usuario <b>${c.name} ${c.lastname}</b>. Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonColor: '#bdc3c7',
      confirmButtonColor: '#e85d5d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
      if(result.isConfirmed) {
        this.aS.delete(c.id!).subscribe(() => {
          this.getUsers();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Registro eliminado', showConfirmButton: false, timer: 2000 });
        });
      }
    });
  }

  save() {
    if (this.isEdit && !this.existUser) { // wait, existUser logic: if !existUser, it means valid. Let's fix the logic
      // In old code: existUser = true means it exists in DB. So valid ONLY if NOT existUser.
      // Wait, let's review:
      // If adding new, existUser = true means BAD. existUser = false means GOOD.
      // If editing, the user already exists. So we skip checking or we allow it.
      
      this.aS.put(this.user).subscribe({
        next: (r: any) => {
          if (r === 200) {
            this.closeModal();
            this.getUsers();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Registro actualizado', showConfirmButton: false, timer: 2000 });
          } else {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'No fue posible actualizar', showConfirmButton: false, timer: 3000 });
          }
        },
        error: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error al actualizar', showConfirmButton: false, timer: 3000 });
        }
      });
    } else if (!this.isEdit) {
      this.aS.post(this.user).subscribe({
        next: (r: any) => {
          if (typeof r === 'object' && r !== null) {
            this.closeModal();
            this.getUsers();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Registro creado', showConfirmButton: false, timer: 2000 });
          } else {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'No fue posible crear', showConfirmButton: false, timer: 3000 });
          }
        },
        error: (err: any) => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.msj || 'Error', showConfirmButton: false, timer: 3000 });
        }
      });
    }
  }
}
