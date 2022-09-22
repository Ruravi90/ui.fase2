import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../services';
import { User } from '../../models';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { debounceTime } from "rxjs/operators";

declare var $: any, iziToast: any;

@Component({
  selector: 'app-agents',
  templateUrl: './agent.component.html'
})

export class AgentComponent implements OnInit {
  public agents: User[] = [];
  private timeout?: number;
  public agent: User = new User();
  public isEdit: Boolean = false;
  public existUser: Boolean = false;

  private usernameChange: Subject<string> = new Subject();

  constructor(private aS: AgentService) {
  }

  ngOnInit() {
    const that = this;
    that.getAgents();
    // generate random values for mainChart
    $('#modalAgent').on('show.bs.modal', function () {
    });

    $('#modalAgent').on('hidden.bs.modal', function () {
      that.getAgents();
    });
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
    $('#modalAgent').modal('show');
  }

  editAgent(c: User): void {
    this.isEdit = true;
    setTimeout(() => {
      this.aS.getById(c.id!).subscribe(r => {
        this.agent = r;
        $('#modalAgent').modal('show');
      });
    }, 300);
  }

  async deleteAgent(c: User) {
    Swal.fire({
      title: 'Alerta!',
      text: 'Estas seguro de continuar',
      icon: 'question',
      reverseButtons: true,
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result:any) => {
      if (result.value) {
        this.aS.delete(c.id!).subscribe(r => {
          this.getAgents();
          iziToast.show({
            title: 'Registro eliminado'
          });
        });
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        );
      }
    });
  }

  save() {
    if (this.isEdit && this.existUser) {
      this.aS.put(this.agent).subscribe(r => {
        if (r === 200) {
          $('#modalAgent').modal('hide');
          iziToast.show({
              title: 'Registro actualizado'
          });
        } else {
          iziToast.show({
              title: 'No fue posible actualizar el registro',
              color: 'red'
          });
        }
       });
    } else {
      this.aS.post(this.agent).subscribe(r => {
        if (r === 200) {
          $('#modalAgent').modal('hide');
          iziToast.show({
              title: 'Registro creado'
          });
        } else {
          iziToast.show({
            title: 'No fue posible crear el registro',
            color: 'red'
          });
        }
       });
    }
  }

}
