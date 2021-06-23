import { Component, OnInit } from '@angular/core';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { client } from '../../../models/entitys/client';
import { ClientService } from '../../../services/client.service';
import * as Feather from 'feather-icons';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { setStatusClientRequest } from '../../../models/request/setstatusclient';
import { Toast, ToastrService } from 'ngx-toastr';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-get-clients',
  templateUrl: './get-clients.component.html',
  styleUrls: ['./get-clients.component.scss']
})
export class GetClientsComponent implements OnInit {
  clients : PaginationListResponse<client> | undefined;
  constructor(private clientService : ClientService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    Feather.replace();
    this.getClients();

    moment().locale('es');
  }

  getClients()
  {
    this.clientService.getClients().subscribe(request=>
      {
        this.clients=request;
      },error=>
      {
        console.log(error);
      })
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  edit(client: client) {
    this.router.navigate(['home/clients/update'], {
      queryParams: { client: JSON.stringify(client) },
      skipLocationChange: true, //skip location para ocultar el json de la URL
    });
  }



  SetStatusUser(client: client, stat: boolean) {
    const RequestDelete = new setStatusClientRequest();
    RequestDelete.clientID = client.clientID;
    RequestDelete.status = stat;
    this.clientService.deleteClient(RequestDelete).subscribe(
      (response) => {
        client.status = stat;
        if (client.status)
          this.toastr.success(
            'Cliente restaurado correctamente',
            '¡Restauración realizada!'
          );
        else this.toastr.success('Usuario eliminado correctamente','¡Adios!');
      },
      (error) => console.log(error)
    );
  }

  DelSelected(client: client) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de Cliente';
    modal.componentInstance.message =
      '¿Desea eliminar a ' + client.firstName + ' ' + client.lastName + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusUser(client, false);
        }
      })
      .catch((err) => {});
  }

  Restoreclient(client: client) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restaurarión de cliente';
    modal.componentInstance.message =
      '¿Desea restaurar a ' + client.firstName + ' ' + client.lastName + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusUser(client, true);
        }
      })
      .catch((err) => {});
  }

  getAddres(client: client) {
    let modal = this.modalService.open(AlertModalComponent, {
      centered: true,
    });

    modal.componentInstance.numModal = 1;
    modal.componentInstance.title = 'Dirección de Cliente';

    if (client.addressID) {
      modal.componentInstance.userAddress = client;
    }
    modal.result;
  }
}
