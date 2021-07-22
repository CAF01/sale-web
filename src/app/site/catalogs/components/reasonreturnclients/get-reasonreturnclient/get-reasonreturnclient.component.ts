import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ReasonReturnInfo } from '../../../models/entitys/reasonreturninfo';
import { reasonClientInsertRequest } from '../../../models/request/reasonclientinsertrequest';
import { CatalogService } from '../../../services/catalog.service';
import * as Feather from 'feather-icons';
import { ClientService } from 'src/app/site/clients/services/client.service';
import { UpdateReasonreturnclientComponent } from '../update-reasonreturnclient/update-reasonreturnclient.component';

@Component({
  selector: 'app-get-reasonreturnclient',
  templateUrl: './get-reasonreturnclient.component.html',
  styleUrls: ['./get-reasonreturnclient.component.scss']
})
export class GetReasonreturnclientComponent implements OnInit {
  reasonsList: ReasonReturnInfo[];
  formSubmitAttempt: boolean;

  reasonForm: FormGroup;
  newReason: reasonClientInsertRequest;

  validateForm = ValidateForm;
  statusBrands?: boolean=true;
  
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService: CatalogService,
    private modalService : NgbModal,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.formSubmitAttempt = true;
    this.getReasons();
    this.SetValidatorReasons();
  }

  onSubmit() {
    if (this.reasonForm.valid) {
      this.formSubmitAttempt = true;
      this.newReason = this.reasonForm.value;
      this.catalogService.insertReasonReturnClient(this.newReason).subscribe(
        (request) => {
          this.toastr.success('Nueva razón de devolución agregada','¡Correcto!');
          let newReason = new ReasonReturnInfo();
          newReason.reasonID=request;
          newReason.description=this.newReason.description;
          newReason.observation=this.newReason.observation;
          this.reasonsList.push(newReason);
        },
        (error) => {
          console.log(error);
        }
      );
      this.reasonForm.reset();
    } else {
      this.validateForm.validateAllFormFields(this.reasonForm);
      this.formSubmitAttempt = false;
    }
  }

  SelectReason(reason:ReasonReturnInfo)
  {
    let modal = this.modalService.open(UpdateReasonreturnclientComponent, { centered: true });

    modal.componentInstance.title = 'Actualizar razón de devolución';
    modal.componentInstance.reasonList=this.reasonsList;
    modal.componentInstance.ModalNum=3;
    modal.componentInstance.reasonToModify=reason;

    modal.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((err) => {});
  }

  getReasons() {
    this.clientService.getReasons().subscribe(
      (request) => {
        this.reasonsList = request;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  validationInput(field: string): boolean {
    return this.reasonForm.get(field).errors != undefined;
  }

  SetValidatorReasons() {
    this.reasonForm = this._formBuilder.group({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      observation: new FormControl('', [
        Validators.maxLength(100),
      ]),
    });
  }
}
