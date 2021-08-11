import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { HistorialPaymentModalComponent } from 'src/app/site/shared-components/historial-payment-modal/historial-payment-modal.component';
import { PendingPaymentInfo } from '../../../models/entitys/pendingpaymentinfo';
import { SalesService } from '../../../services/sales.service';
import { NewPaymentHistorialComponent } from '../../payment-historial/new-payment-historial/new-payment-historial.component';

@Component({
  selector: 'app-get-pending-payments',
  templateUrl: './get-pending-payments.component.html',
  styleUrls: ['./get-pending-payments.component.scss']
})
export class GetPendingPaymentsComponent implements OnInit {

  status:boolean=true;

  Payments : PaginationListResponse<PendingPaymentInfo> | undefined;

  constructor(
    private router: Router,
    private toastr : ToastrService,
    private _formBuilder: FormBuilder,
    private saleService:SalesService,
    private modalService:NgbModal) { }

  ngOnInit(): void {
    this.getPendingPayments();
  }

  SetStat(val:number)
  {
    if(val==1)
    {
       this.status=undefined;
    }
    if(val==2)
    {
      this.status=true;
    }
    if(val==3)
    {
      this.status=false;
    }
  }

  getPendingPayments()
  {
    this.saleService.GetPendingPayments().subscribe(request=>
      {
        this.Payments=request;
      },error=>
      {
        console.log(error);
      });
  }

  getHistorialPayment(id:number)
  {
    let modal = this.modalService.open(HistorialPaymentModalComponent, {
      centered: true,
    });

    modal.componentInstance.pendingID = id;

    modal.result;
  }

  adPayment(pending:PendingPaymentInfo)
  {
    let modal = this.modalService.open(NewPaymentHistorialComponent, {
      centered: true,
    });

    modal.componentInstance.pendingPayment = pending;

    modal.result;
  }

  calc(indeb,payed)
  {
    return parseFloat((indeb-payed).toFixed(2));
  }

}
