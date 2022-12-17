import { Component, OnInit, ViewChild } from '@angular/core';
import { AgentService } from '../../services';
import { User } from '../../models';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agents',
  templateUrl: './agent.component.html'
})

export class AgentComponent implements OnInit {
  @ViewChild('modalAgent', { static: false }) modalAgent?: ModalDirective;
  public agents: User[] = [];
  private timeout?: number;
  public agent: User = new User();
  public isEdit: Boolean = false;
  public existUser: Boolean = false;

  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  private usernameChange: Subject<string> = new Subject();

  constructor(private aS: AgentService) {
  }

  ngOnInit() {
    const that = this;
    that.getAgents();
  }

  getAgents() {
    this.aS.get().subscribe((r) => {
      this.agents = r;
    });
  }

  onExistUser() {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.aS.getExist(this.agent.username!).subscribe((r) => {
        this.existUser = r;
      });
    } , 300);
  }

  addAgent(): void {
    this.isEdit = false;
    this.agent = new User();
    this.modalAgent?.show();
  }

  editAgent(c: User): void {
    this.isEdit = true;
    setTimeout(() => {
      this.aS.getById(c.id!).subscribe(r => {
        this.agent = r;
        this.modalAgent?.show();
      });
    }, 300);
  }

  async deleteAgent(c: User) {
    swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.aS.delete(c.id!).subscribe(r => {
          this.getAgents();
          this.toast.fire({
            icon: 'success',
            title: 'Registro eliminado'
          });
        });
      }
    });
  }

  save() {
    if (this.isEdit && this.existUser) {
      this.aS.put(this.agent).subscribe(r => {
        if (r === 200) {
          this.modalAgent?.hide();
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
      this.aS.post(this.agent).subscribe(r => {
        if (r === 200) {
          this.modalAgent?.hide();
          this.toast.fire({
            icon: 'error',
            title: 'Registro creado'
          });
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'No fue posible crear el registro',
          });
        }
       });
    }
  }

}
