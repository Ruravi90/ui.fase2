import { Component, OnInit } from '@angular/core';
import {ClientService, TypeService} from '../../services';
import { Client, _Type, Paginate, Address } from '../../models';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

declare var $: any, iziToast: any;

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
    $('#modalClient').on('show.bs.modal', function () {
    });

    $('#modalClient').on('hidden.bs.modal', function () {
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
        $('#modalClient').modal('hide');
          iziToast.show({
              title: 'Registro actualizado'
        });
      });
    } else {
      this.clientService.post(this.client).subscribe(r => {
        this.isBusy = false;
        $('#modalClient').modal('hide');
        iziToast.show({
            title: 'Registro creado'
        });
      },e =>{
        this.isBusy = false;
        iziToast.show({
          color: 'yellow', // blue, red, green, yellow,
          position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
          title: e.error
        });
      });
    }
  }

  addClient(): void {
    this.isEdit = false;
    this.getTypes();
    this.client = new Client();
    $('#modalClient').modal('show');
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
        $('#modalClient').modal('show');
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
      if (result.value) {
        this.clientService.delete(c.id!).subscribe(r => {
          const index = this.clients.findIndex(cl => cl.id === c.id);
          if (index > -1) {
            this.clients.splice(index, 1);
          }
          iziToast.show({
            title: 'Registro eliminado'
          });
        });
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      }
      // else if (result.dismiss === swal.DismissReason.cancel) {
      //  swal.fire(
      //    'Cancelled',
      //    'Your imaginary file is safe :)',
      //    'error'
      //  );
      //}
    });
  }
}
