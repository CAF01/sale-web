import { Component, OnInit, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ProviderInfo } from '../../../models/entitys/provider';
import { ProviderService } from '../../../services/provider.service';
import * as Feather from 'feather-icons';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';
import { setStatusProviderRequest } from '../../../models/request/setstatusproviderrequest';

@Component({
  selector: 'app-get-providers',
  templateUrl: './get-providers.component.html',
  styleUrls: ['./get-providers.component.scss'],
})
export class GetProvidersComponent implements OnInit {
  providers: PaginationListResponse<ProviderInfo> | undefined;
  viewOptions? : boolean = undefined;

  page: number = 1;

  constructor(
    private providerService: ProviderService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.getProviders();
    moment().locale('es');
  }

  getProviders() {
    this.providerService.getProviders().subscribe(
      (response) => {
        this.providers = response;
      },
      (error) => {}
    );
  }

  edit(provider: ProviderInfo) {
    this.router.navigate(['home/providers/update-provider'], {
      queryParams: { provider: JSON.stringify(provider) },
      skipLocationChange: true, //skip location para ocultar el json de la URL
    });
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  deleteProvider(provider:ProviderInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación';
    modal.componentInstance.message = '¿Desea quitar el registro de ' + provider.companyName +' como proveedor?';

    modal.result
      .then((result) => {
        if (result) {
          this.setStatusProvider(provider, false);
        }
      })
      .catch((err) => {});

  }

  restoreProvider(provider:ProviderInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar restauración';
    modal.componentInstance.message = '¿Desea restaurar el registro de ' + provider.companyName +'?';

    modal.result
      .then((result) => {
        if (result) {
          this.setStatusProvider(provider, true);
        }
      })
      .catch((err) => {});
  }

  setStatusProvider(provider:ProviderInfo, status:boolean)
  {
    const requestStatus = new setStatusProviderRequest;
    requestStatus.providerID=provider.providerID;
    requestStatus.status=status;

    this.providerService.setStatus(requestStatus).subscribe(request=>{
      provider.status=status
    },error=>
    {
      console.log(error);
    });
  }

  SetStat(option:number)
  {
    if(option==1)
      this.viewOptions=undefined;
    if(option==2)
      this.viewOptions=true;
    if(option==3)
      this.viewOptions=false;
  }

  showNotesProvider(provider:ProviderInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });
    modal.componentInstance.numModal=2;
    modal.componentInstance.title = 'Notas del proveedor';
    if(provider.notes)
      modal.componentInstance.message = provider.notes;
    else
      modal.componentInstance.message = 'Este proveedor no tiene ninguna nota registrada';
  }

  pageChange(page: any) {
    this.providerService
      .getProvidersByPage((page - 1) * this.providers.pageSize)
      .subscribe((response) => {
        this.providers = response;
      });
  }
}
