import { FormControl, FormGroup } from '@angular/forms';

export class ValidateForm {
  public static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public static ValidateImgUpload(file: File): boolean {
    if (
      file &&
      (file.type == 'image/jpg' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/png')
    ) {
      return true;
    }

    return false;
  }

  public static ValidationSizeImg(file: File, size: number = 6000000) {
    if (file && file.size > size) {
      return { maxSize: size, result: false };
    }
    return { maxSize: size, result: true };
  }
}
