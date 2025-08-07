import { Directive, Input, OnInit, OnDestroy, Optional, Self } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMutuallyExclusiveCheckbox]',
  standalone: true
})
export class MutuallyExclusiveCheckboxDirective implements OnInit, OnDestroy {
  @Input() formArray!: FormArray;
  @Input() controlName!: string;
  @Input() relatedControlName?: string; // Optional: control to manage when this is checked (e.g., 'dateOfEnd')

  private subscription?: Subscription;
  private currentFormControl?: FormControl;

  constructor(@Optional() @Self() private ngControl: NgControl) {}

  ngOnInit(): void {
    this.setupMutualExclusivity();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private setupMutualExclusivity(): void {
    // Get the current form control from the NgControl
    this.currentFormControl = this.ngControl?.control as FormControl;
    
    if (!this.currentFormControl) {
      console.warn('MutuallyExclusiveCheckbox: Could not find form control');
      return;
    }

    // Subscribe to value changes
    this.subscription = this.currentFormControl.valueChanges.subscribe(isChecked => {
      if (isChecked) {
        this.handleCheckboxChecked();
      } else {
        this.handleCheckboxUnchecked();
      }
    });

    // Set initial state for newly added controls
    this.setInitialState();
  }

  private handleCheckboxChecked(): void {
    // Disable and uncheck all other checkboxes in the same form array
    const formGroups = this.formArray.controls as FormGroup[];
    
    formGroups.forEach(group => {
      const control = group.get(this.controlName) as FormControl;
      if (control && control !== this.currentFormControl) {
        control.setValue(false, { emitEvent: false });
        control.disable({ emitEvent: false });
      }
    });

    // Handle related control (e.g., disable dateOfEnd when still employed)
    this.handleRelatedControl(true);
  }

  private handleCheckboxUnchecked(): void {
    // Re-enable all other checkboxes only if no other checkbox is checked
    if (!this.hasAnyCheckedCheckbox()) {
      const formGroups = this.formArray.controls as FormGroup[];
      
      formGroups.forEach(group => {
        const control = group.get(this.controlName) as FormControl;
        if (control) {
          control.enable({ emitEvent: false });
        }
      });
    }

    // Handle related control (e.g., enable and require dateOfEnd when not still employed)
    this.handleRelatedControl(false);
  }

  private hasAnyCheckedCheckbox(): boolean {
    const formGroups = this.formArray.controls as FormGroup[];
    return formGroups.some(group => {
      const control = group.get(this.controlName) as FormControl;
      return control?.value === true;
    });
  }

  private handleRelatedControl(isChecked: boolean): void {
    if (!this.relatedControlName || !this.currentFormControl?.parent) {
      return;
    }

    const relatedControl = this.currentFormControl.parent.get(this.relatedControlName);
    if (!relatedControl) {
      return;
    }

    if (isChecked) {
      // When checkbox is checked, clear and disable related control
      relatedControl.setValue(null, { emitEvent: false });
      relatedControl.clearValidators();
      relatedControl.disable({ emitEvent: false });
    } else {
      // When checkbox is unchecked, enable and add validators to related control
      relatedControl.enable({ emitEvent: false });
      relatedControl.setValidators([Validators.required]);
    }
    relatedControl.updateValueAndValidity({ emitEvent: false });
  }

  private setInitialState(): void {
    if (!this.currentFormControl) {
      return;
    }

    // If there's already a checked checkbox in the array, disable this one
    if (this.hasAnyCheckedCheckbox() && !this.currentFormControl.value) {
      this.currentFormControl.disable({ emitEvent: false });
    }
  }
}
