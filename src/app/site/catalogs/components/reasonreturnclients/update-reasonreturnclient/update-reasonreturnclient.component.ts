import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ReasonReturnInfo } from '../../../models/entitys/reasonreturninfo';
import { reasonClientInsertRequest } from '../../../models/request/reasonclientinsertrequest';
import { reasonClientUpdateRequest } from '../../../models/request/reasonclientupdaterequest';
import { reasonProviderInsertRequest } from '../../../models/request/reasonproviderinsertrequest';
import { reasonProviderUpdateRequest } from '../../../models/request/reasonproviderupdaterequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-update-reasonreturnclient',
  templateUrl: './update-reasonreturnclient.component.html',
  styleUrls: ['./update-reasonreturnclient.component.scss']
})
export class UpdateReasonreturnclientComponent implements OnInit {
  @Input() ModalNum:number;
  @Input() title:string;
  @Input() message?:string;
  @Input() reasonList: ReasonReturnInfo[];
  @Input() reasonToModify: ReasonReturnInfo;


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  reasonForm : FormGroup;

  formSubmitAttempt : boolean=true;
  newReasonClient:reasonClientInsertRequest;
  updateReasonClient:reasonClientUpdateRequest;
  updateReasonProvider:reasonProviderUpdateRequest;
  newReasonProvider:reasonProviderInsertRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorReasons();
    if(this.ModalNum>2)
    {
      this.reasonForm.get('description').setValue(this.reasonToModify.description);
      this.reasonForm.get('observation').setValue(this.reasonToModify.observation);
    }
  }

  Insert()
  {
    if(this.reasonForm.valid)
    {
      if(this.ModalNum==1)
      {
        this.newReasonClient=this.reasonForm.value;
        this.catalogService.insertReasonReturnClient(this.newReasonClient).subscribe(request=>
        {
          var newAddedReason = new ReasonReturnInfo();
          newAddedReason.reasonID=request;
          newAddedReason.description=this.newReasonClient.description;
          newAddedReason.observation=this.newReasonClient.observation;
          this.reasonList.push(newAddedReason);
          this.toastr.success('Nueva razón añadida','¡Correcto!');
          this.modal.close(true);
        },
        error=>
        {
          console.log(error);
        })
      }
      if(this.ModalNum==2)
      {
        this.newReasonProvider=this.reasonForm.value;
        this.catalogService.insertReasonReturnProvider(this.newReasonProvider).subscribe(request=>
        {
          var newAddedReason = new ReasonReturnInfo();
          newAddedReason.reasonID=request;
          newAddedReason.description=this.newReasonProvider.description;
          newAddedReason.observation=this.newReasonProvider.observation;
          this.reasonList.push(newAddedReason);
          this.toastr.success('Nueva razón añadida','¡Correcto!');
          this.modal.close(true);
        },
        error=>
        {
          console.log(error);
        })
      }
      
    }
    else
    {
      this.validateForm.validateAllFormFields(this.reasonForm);
      this.formSubmitAttempt=false;
    }
    
  }
  update()
  {
    if(this.reasonForm.valid)
    {
      if(this.ModalNum==3)
      {
        this.updateReasonClient=this.reasonForm.value;
        this.updateReasonClient.reasonID=this.reasonToModify.reasonID;
        this.catalogService.updateReasonReturnClient(this.updateReasonClient).subscribe(request=>
        {
          if(request)
          {
            let newReasonUpdated = new ReasonReturnInfo();
            newReasonUpdated.reasonID=this.reasonToModify.reasonID;
            newReasonUpdated.description=this.updateReasonClient.description;
            newReasonUpdated.observation=this.updateReasonClient.observation;
            let pos = this.reasonList.findIndex(d=>d.reasonID==this.reasonToModify.reasonID);
            this.reasonList[pos]=newReasonUpdated;
            this.toastr.success('Razón actualizada correctamente','¡Correcto!');
            this.modal.close(true);
          }
        },
        error=>
        {
          console.log(error);
        });
      }
      if(this.ModalNum==4)
      {
        this.updateReasonProvider=this.reasonForm.value;
        this.updateReasonProvider.reasonID=this.reasonToModify.reasonID;
        this.catalogService.updateReasonReturnProvider(this.updateReasonProvider).subscribe(request=>
        {
          if(request)
          {
            let newReasonUpdated = new ReasonReturnInfo();
            newReasonUpdated.reasonID=this.reasonToModify.reasonID;
            newReasonUpdated.description=this.updateReasonProvider.description;
            newReasonUpdated.observation=this.updateReasonProvider.observation;
            let pos = this.reasonList.findIndex(d=>d.reasonID==this.reasonToModify.reasonID);
            this.reasonList[pos]=newReasonUpdated;
            this.toastr.success('Razón actualizada correctamente','¡Correcto!');
            this.modal.close(true);
          }
        },
        error=>
        {
          console.log(error);
        });
      }
    }
    else
    {
      this.validateForm.validateAllFormFields(this.reasonForm);
      this.formSubmitAttempt=false;
    }
    
  }

  SetValidatorReasons() {
    this.reasonForm = this._formBuilder.group({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      observation:new FormControl('',[Validators.maxLength(100)])
    });

  }

  validationInput(field: string): boolean {
    return this.reasonForm.get(field).errors != undefined;
  }
}
