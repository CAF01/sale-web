import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentHistorialInfo } from '../../sales/models/entitys/paymenthistorialinfo';
import { SalesService } from '../../sales/services/sales.service';

@Component({
  selector: 'app-historial-payment-modal',
  templateUrl: './historial-payment-modal.component.html',
  styleUrls: ['./historial-payment-modal.component.scss']
})
export class HistorialPaymentModalComponent implements OnInit {
  @Input() pendingID:number;
  Historial:PaymentHistorialInfo[];
  void:boolean=true;


  constructor(public modal: NgbActiveModal,
    private saleService:SalesService) {}

  ngOnInit(): void {
    this.getHistorial();
  }

  getHistorial()
  {
    this.saleService.getHistorialByID(this.pendingID).subscribe(response=>
      {
        if(response.length>0)
        {
          this.Historial=response;
          this.void=false;
        }
        else
        {
          this.void=true;
        }
      },error=>
      {
        console.log(error);
        this.void=true;
      });
  }

}
