import { Component, OnInit, ViewChild } from '@angular/core';
import {ClientService, TypeService} from '../../services';
import { Client, _Type, Paginate, Address } from '../../models';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  public clients: Client[] = [];
  public client: Client = new Client();
  public cmbReferences$: _Type[] = [];
  public isEdit: Boolean = false;
  public isBusy: Boolean = false;

  public paginate: Paginate = new Paginate();
  public perPage = 15;
  public shared: string | undefined;
  private sharedChange = new Subject();
  @ViewChild('modalClient', { static: false }) modalClient?: ModalDirective;

  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  constructor(
    private clientService: ClientService,
    private typeService: TypeService) {
      this.sharedChange.pipe(
        debounceTime(500)
      ).subscribe(e => this.getClients());
  }

  ngOnInit(): void {
    this.shared = '';
    this.getClients();
    const that = this;
    // generate random values for mainChart
    this.modalClient?.onHide.subscribe(()=>{
      that.getClients();
    });

  }

  sharedClient(event:any) {
    this.sharedChange.next(event);
  }

  getClients() {
    this.clientService.paginate(this.perPage, this.shared).subscribe(res => {
     this.paginate = res;
     this.getPages();
     this.clients = res.data;
    });
  }

  pageChanged(event: any){
    this.clientService.getForUrl(event.page, this.perPage).subscribe(res => {
      this.paginate = res;
      this.getPages();
      this.clients = res.data;
    });
  }

  getPages() {
    this.paginate.pages = [];
    for (let _i = 1; _i <= (this.paginate.total! / this.perPage); _i++) {
      this.paginate.pages.push(_i);
    }
  }

  getTypes() {
    this.typeService.getAll('cat_references').subscribe((result)=>{
      this.cmbReferences$ = result;
    });
  }

  save() {
    this.isBusy = true;
    //this.client.reference_id = this.client.reference.id;
    if (this.isEdit) {
      this.clientService.put(this.client).subscribe(r => {
        this.isBusy = false;
        this.modalClient?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro actualizado'
        });
      });
    } else {
      this.clientService.post(this.client).subscribe(r => {
        this.isBusy = false;
        this.modalClient?.hide();
        this.toast.fire({
          icon:'success',
          title: 'Registro creado'
        });
      },e =>{
        this.isBusy = false;
        this.toast.fire({
          icon:'warning',
          title: e.error
        });
      });
    }
  }

  addClient(): void {
    this.isEdit = false;
    this.getTypes();
    this.client = new Client();
    this.modalClient?.show();
  }

  editClient(c: Client): void {
    this.isEdit = true;
    this.getTypes();
    setTimeout(() => {
      this.clientService.getById(c.id!).subscribe(r => {
        this.client = r;
        this.client.reference_id = Number(this.client.reference_id);
        if (this.client.address!.length === 0) {
          this.client.address = [new Address()];
        }
        this.modalClient?.show();
      });
    }, 300);
  }

  async deleteClient(c: Client) {
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
      if (result.isConfirmed) {
        this.clientService.delete(c.id!).subscribe(r => {
          const index = this.clients.findIndex(cl => cl.id === c.id);
          if (index > -1) {
            this.clients.splice(index, 1);
          }
          this.toast.fire({
            icon:'success',
            title: 'Registro eliminado'
          });
        });
      }
    });
  }
}
