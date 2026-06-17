import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ClientService, TypeService } from '../../services';
import { Client, _Type, Paginate, Address } from '../../models';
import swal from 'sweetalert2';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CommonModule, UpperCasePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';

declare var iziToast: any;

@Component({
    selector: 'app-clients',
    imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule, UpperCasePipe],
    templateUrl: 'clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  public clients: Client[] = [];
  public client: Client = new Client();
  public cmbReferences$!: _Type[];
  public isEdit: Boolean = false;
  public isBusy: Boolean = false;
  public isModalOpen: boolean = false;

  get primaryAddress(): Address {
    if (!this.client.address || this.client.address.length === 0) {
      this.client.address = [new Address()];
    }
    return this.client.address[0];
  }

  public paginate: Paginate = new Paginate();
  public perPage = 15;
  public shared = '';
  private sharedChange = new Subject();

  constructor(
    private clientService: ClientService,
    private typeService: TypeService,
    private cdr: ChangeDetectorRef) {
      this.sharedChange.pipe(
        debounceTime(500)
      ).subscribe((e: any) => this.getClients());
  }

  ngOnInit(): void {
    this.getClients();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.getClients(); // Refresh list after close
  }

  sharedClient(event:any) {
    this.sharedChange.next(event);
  }

  isLoading = true;
  getClients() {
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.clientService.paginate(this.perPage, this.shared).subscribe(res => {
     this.paginate = res;
     this.getPages();
     this.clients = res.data;
     this.isLoading = false;
     this.cdr.detectChanges();
    });
  }

  pageChanged(event: any){
    this.isLoading = true;
    setTimeout(() => this.cdr.detectChanges(), 0);
    this.clientService.getForUrl(event.page, this.perPage).subscribe(res => {
      this.paginate = res;
      this.getPages();
      this.clients = res.data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  getPages() {
    this.paginate.pages = [];
    for (let _i = 1; _i <= ((this.paginate.total || 0) / this.perPage); _i++) {
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
        this.closeModal();
          iziToast.show({
              title: 'Registro actualizado'
        });
      });
    } else {
      this.clientService.post(this.client).subscribe(r => {
        this.isBusy = false;
        this.closeModal();
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
    this.isModalOpen = true;
  }

  editClient(c: Client): void {
    this.isEdit = true;
    this.getTypes();
    setTimeout(() => {
      this.clientService.getById(c.id!).subscribe(r => {
        this.client = r;
        this.client.reference_id = Number(this.client.reference_id);
        if (this.client.address?.length === 0) {
          this.client.address = [new Address()];
        }
        this.isModalOpen = true;
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
