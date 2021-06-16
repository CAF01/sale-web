import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../users/models/entitys/user';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  @Input() numModal:number=0;
  @Input() title:string;
  @Input() message?:string;
  @Input() userAddress?:User;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
}
