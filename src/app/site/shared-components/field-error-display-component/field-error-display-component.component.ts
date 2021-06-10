import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display-component.component.html',
  styleUrls: ['./field-error-display-component.component.scss']
})
export class FieldErrorDisplayComponentComponent {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
}
