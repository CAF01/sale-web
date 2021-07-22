import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ReasonReturnInfo } from '../../../models/entitys/reasonreturninfo';
import { reasonProviderInsertRequest } from '../../../models/request/reasonproviderinsertrequest';
import { CatalogService } from '../../../services/catalog.service';
import * as Feather from 'feather-icons';
import { UpdateReasonreturnclientComponent } from '../../reasonreturnclients/update-reasonreturnclient/update-reasonreturnclient.component';
import { ProviderService } from 'src/app/site/providers/services/provider.service';

@Component({
  selector: 'app-get-reasonreturnprovider',
  templateUrl: './get-reasonreturnprovider.component.html',
  styleUrls: ['./get-reasonreturnprovider.component.scss']
})
export class GetReasonreturnproviderComponent implements OnInit {
  reasonsList: ReasonReturnInfo[];
  formSubmitAttempt: boolean;

  reasonForm: FormGroup;
  newReason: reasonProviderInsertRequest;

  validateForm = ValidateForm;
  statusBrands?: boolean=true;
  
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService: CatalogService,
    private modalService : NgbModal,
    private providerService: ProviderService
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
      this.catalogService.insertReasonReturnProvider(this.newReason).subscribe(
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
    modal.componentInstance.ModalNum=4;
    modal.componentInstance.reasonToModify=reason;

    modal.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((err) => {});
  }

  getReasons() {
    this.providerService.getReasonReturn().subscribe(
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
