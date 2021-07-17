import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ReasonReturnInfo } from '../../../models/entitys/reasonreturninfo';
import { reasonClientInsertRequest } from '../../../models/request/reasonclientinsertrequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-update-reasonreturnclient',
  templateUrl: './update-reasonreturnclient.component.html',
  styleUrls: ['./update-reasonreturnclient.component.scss']
})
export class UpdateReasonreturnclientComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() reasonList: ReasonReturnInfo[];


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  reasonForm : FormGroup;

  formSubmitAttempt : boolean=true;
  newReasonClient:reasonClientInsertRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorReasons();
  }

  Insert()
  {
    if(this.reasonForm.valid)
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
