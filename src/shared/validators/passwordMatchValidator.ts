import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordKey);
    const confirmPassword = control?.value;

    return password === confirmPassword ? null : { mismatch: true };
  };
}