import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgentService } from '../../services';
import { User } from '../../models';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import Swal from "sweetalert2";

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule],
  templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit {
  public agents: User[] = [];
  public agent: User = new User();
  public isEdit = false;
  public existUser = false;

  public loading = false;
  public showModal = false;

  private usernameChange: Subject<string> = new Subject();

  constructor(
    private aS: AgentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAgents();

    this.usernameChange.pipe(debounceTime(300)).subscribe(() => {
      if (this.agent.username) {
        this.aS.getExist(this.agent.username).subscribe((r) => {
          this.existUser = r;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getAgents() {
    this.loading = true;
    this.aS.get().subscribe({
      next: (r: any) => {
        this.agents = r;
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
    this.usernameChange.next(this.agent.username!);
  }

  addAgent(): void {
    this.isEdit = false;
    this.existUser = false;
    this.agent = new User();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  editAgent(c: User): void {
    this.isEdit = true;
    this.existUser = true; // when editing, we assume valid
    this.loading = true;

    this.aS.getById(c.id!).subscribe({
      next: (r: any) => {
        this.agent = r;
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

  deleteAgent(c: User) {
    Swal.fire({
      title: '¿Eliminar agente?',
      html: `<p style="color:#555;font-size:0.95rem">Se eliminará al agente <b>${c.name} ${c.lastname}</b>. Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonColor: '#bdc3c7',
      confirmButtonColor: '#e85d5d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.aS.delete(c.id!).subscribe(() => {
          this.getAgents();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Agente eliminado',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }

  save() {
    if (this.isEdit && this.existUser) {
      this.aS.put(this.agent).subscribe({
        next: (r: any) => {
          if (r === 200) {
            this.closeModal();
            this.getAgents();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Agente actualizado', showConfirmButton: false, timer: 2000 });
          } else {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'No fue posible actualizar', showConfirmButton: false, timer: 3000 });
          }
        },
        error: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error al actualizar', showConfirmButton: false, timer: 3000 });
        }
      });
    } else if (!this.isEdit) {
      this.aS.post(this.agent).subscribe({
        next: (r: any) => {
          if (r === 200) {
            this.closeModal();
            this.getAgents();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Agente creado', showConfirmButton: false, timer: 2000 });
          } else {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'No fue posible crear', showConfirmButton: false, timer: 3000 });
          }
        },
        error: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error al crear', showConfirmButton: false, timer: 3000 });
        }
      });
    }
  }

}
