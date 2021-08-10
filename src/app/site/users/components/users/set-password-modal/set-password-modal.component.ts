import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SecurityHelper } from 'src/app/site/core/helpers/security-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { userSetPassRequest } from '../../../models/request/usersetpassrequest';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-set-password-modal',
  templateUrl: './set-password-modal.component.html',
  styleUrls: ['./set-password-modal.component.scss']
})
export class SetPasswordModalComponent implements OnInit {

  @Input() userID: number;
  // equal:boolean=true;
  submitAttempt: boolean = true;
  setPasswordForm: FormGroup;
  
  constructor(
    public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr:ToastrService,
    private config:NgbModalConfig,
    private modalService:NgbModal,
    private userService:UserService
  ){}

  ngOnInit(): void {
    this.SetValidatorsPassword();
    this.config.backdrop="static";
    this.config.keyboard=false;
  }

  onSave()
  {
    if(this.setPasswordForm.valid)
    {
      let password = this.setPasswordForm.get('newPassword').value;
      let passwordConfirm = this.setPasswordForm.get('newPasswordConfirm').value;
      if(password==passwordConfirm)
      {
        let request = new userSetPassRequest();
        request.userID=this.userID;
        request.password=passwordConfirm;
        this.userService.updatePassword(request).subscribe(response=>
          {
            if(response)
            {
              this.toastr.success('Contraseña actualizada correctamente.','Correcto');
              this.closeModal();
            }
          },error=>
          {
            console.log(error);
          })
      }
      else
      {
        this.toastr.error('Las contraseñas deben ser iguales, intentalo de nuevo','ERROR');
        this.setPasswordForm.reset();
      }
    }
  }

  validateForm = ValidateForm;

  SetValidatorsPassword() {
    this.setPasswordForm = this._formBuilder.group({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\u00f1\u00d1]{6,50}$/),
      ]),
      newPasswordConfirm: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\u00f1\u00d1]{6,50}$/),
      ]),
    });
  }

  validationInput(field: string): boolean 
  {
    return this.setPasswordForm.get(field).errors != undefined;
  }

  closeModal()
  {
    SecurityHelper.SetStatusChangeToFalse();
    this.modal.close();
  }

}
