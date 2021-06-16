import { Component, OnInit, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ProviderInfo } from '../../../models/entitys/provider';
import { ProviderService } from '../../../services/provider.service';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-get-providers',
  templateUrl: './get-providers.component.html',
  styleUrls: ['./get-providers.component.scss'],
})
export class GetProvidersComponent implements OnInit {
  providers: PaginationListResponse<ProviderInfo> | undefined;
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
}
