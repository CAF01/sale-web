import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValidateForm } from '../../core/helpers/validate-formfields-helper';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  file: File;

  @Input() Placeholder: string = 'Seleccionar archivo';
  @Input() MaxSize: number = 6000000;
  @Input() Accept: string;

  @Output()
  onSelectFile = new EventEmitter<File>();

  constructor() {}

  ngOnInit(): void {}

  uploadFile(files: FileList): void {
    this.file = files[0];

    if (!ValidateForm.ValidateImgUpload(this.file)) {
      this.file = null;
      return;
    }
    if(!ValidateForm.ValidationSizeImg(this.file))
    {
      this.file=null;
      return;
    }
    this.onSelectFile.emit(this.file);
  }

  // uploadFile
}
