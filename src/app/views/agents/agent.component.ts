import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../services';
import { User } from '../../models';
import { Subject } from 'rxjs';
import swal from "sweetalert2";

declare var $: any, iziToast: any;

@Component({
  selector: 'app-agents',
  templateUrl: './agent.component.html'
})

export class AgentComponent implements OnInit {
  public agents: User[] = [];
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
    $('#modalAgent').on('show.bs.modal', function (event) {
    });

    $('#modalAgent').on('hidden.bs.modal', function (event) {
      that.getAgents();
    });

    this.usernameChange.debounceTime(300).subscribe(() => {
      this.aS.getExist(this.agent.username).subscribe((r) => {
        this.existUser = r;
      });
    });
  }

  getAgents() {
    this.aS.get().subscribe((r) => {
      this.agents = r;
    });
  }

  onExistUser() {
    this.usernameChange.next();
  }

  addAgent(): void {
    this.isEdit = false;
    this.agent = new User();
    $('#modalAgent').modal('show');
  }

  editAgent(c: User): void {
    this.isEdit = true;
    setTimeout(() => {
      this.aS.getById(c.id).subscribe(r => {
        this.agent = r;
        $('#modalAgent').modal('show');
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
    }).then((result) => {
      if (result.value) {
        this.aS.delete(c.id).subscribe(r => {
          this.getAgents();
          iziToast.show({
            title: 'Registro eliminado'
          });
        });
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
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
