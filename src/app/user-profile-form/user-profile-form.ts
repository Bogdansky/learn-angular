import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Observable, from, Subject, takeUntil } from 'rxjs';
import { UserProfile, Gender } from '../../shared/models';
import { MutuallyExclusiveCheckboxDirective } from '../../shared/directives';
import { LookupService } from '../../shared/services/lookup.service';
import { UserProfileService } from '../../shared/services/user-profile.service';
import { Country } from '../../api/country';

@Component({
  selector: 'app-user-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MutuallyExclusiveCheckboxDirective
  ],
  templateUrl: './user-profile-form.html',
  styleUrl: './user-profile-form.scss'
})
export class UserProfileForm implements OnInit, OnDestroy {
  userProfileForm!: FormGroup;
  genderOptions = Object.values(Gender);
  countries$!: Observable<Country[]>;
  isSubmitted = false;
  isEditMode = false; // Track if we're editing existing profile or creating new one
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, 
    private lookupService: LookupService, 
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    this.subscribeToUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToUserProfile(): void {
    this.userProfileService.userProfile
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile && Object.keys(profile).length > 0) {
          this.isEditMode = true;
          this.populateForm(profile);
        } else {
          this.isEditMode = false;
        }
      });
  }

  private loadCountries(): void {
    // Convert the Promise to Observable for async pipe
    this.countries$ = from(this.lookupService.loadCountries());
  }

  private initializeForm(): void {
    this.userProfileForm = this.fb.group({
      generalInfo: this.fb.group({
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        middleName: [''],
        dateOfBirth: ['', [Validators.required]],
        gender: ['']
      }),
      addresses: this.fb.array([this.createAddressFormGroup()]),
      employmentHistory: this.fb.array([this.createEmploymentFormGroup()])
    });
  }

  private populateForm(profile: UserProfile): void {
    // Populate general info
    this.generalInfoForm.patchValue({
      name: profile.name || '',
      surname: profile.surname || '',
      middleName: profile.middleName || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || ''
    });

    // Populate addresses
    if (profile.addresses && profile.addresses.length > 0) {
      // Clear existing addresses first
      while (this.addressesFormArray.length > 0) {
        this.addressesFormArray.removeAt(0);
      }
      
      // Add addresses from profile
      profile.addresses.forEach(address => {
        const addressGroup = this.createAddressFormGroup();
        addressGroup.patchValue(address);
        this.addressesFormArray.push(addressGroup);
      });
    }

    // Populate employment history
    if (profile.employmentHistory && profile.employmentHistory.length > 0) {
      // Clear existing employment records first
      while (this.employmentHistoryFormArray.length > 0) {
        this.employmentHistoryFormArray.removeAt(0);
      }
      
      // Add employment records from profile
      profile.employmentHistory.forEach(employment => {
        const employmentGroup = this.createEmploymentFormGroup();
        const isStillEmployed = employment.dateOfEnd === null || employment.dateOfEnd === undefined;
        
        employmentGroup.patchValue({
          employer: employment.employer,
          dateOfStart: employment.dateOfStart,
          dateOfEnd: employment.dateOfEnd,
          isStillEmployed: isStillEmployed
        });
        
        // If still employed, disable the dateOfEnd field to match the directive behavior
        if (isStillEmployed) {
          const dateOfEndControl = employmentGroup.get('dateOfEnd');
          if (dateOfEndControl) {
            dateOfEndControl.disable({ emitEvent: false });
          }
        }
        
        this.employmentHistoryFormArray.push(employmentGroup);
      });
    }
  }

  get generalInfoForm(): FormGroup {
    return this.userProfileForm.get('generalInfo') as FormGroup;
  }

  get addressesFormArray(): FormArray {
    return this.userProfileForm.get('addresses') as FormArray;
  }

  get employmentHistoryFormArray(): FormArray {
    return this.userProfileForm.get('employmentHistory') as FormArray;
  }

  private createAddressFormGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required]],
      region: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      building: ['', [Validators.required]],
      apartment: ['']
    });
  }

  private createEmploymentFormGroup(): FormGroup {
    const group = this.fb.group({
      employer: ['', [Validators.required]],
      dateOfStart: ['', [Validators.required]],
      dateOfEnd: ['', [Validators.required]], // Will be managed by the directive
      isStillEmployed: [false]
    });

    return group;
  }

  addAddress(): void {
    this.addressesFormArray.push(this.createAddressFormGroup());
  }

  removeAddress(index: number): void {
    if (this.addressesFormArray.length > 1) {
      this.addressesFormArray.removeAt(index);
    }
  }

  addEmployment(): void {
    this.employmentHistoryFormArray.push(this.createEmploymentFormGroup());
  }

  removeEmployment(index: number): void {
    if (this.employmentHistoryFormArray.length > 1) {
      this.employmentHistoryFormArray.removeAt(index);
    }
  }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    
    if (this.userProfileForm.valid) {
      const formValue = this.userProfileForm.getRawValue();
      
      // Transform form data to match UserProfile interface
      const userProfile: UserProfile = {
        name: formValue.generalInfo.name,
        surname: formValue.generalInfo.surname,
        middleName: formValue.generalInfo.middleName || null,
        dateOfBirth: formValue.generalInfo.dateOfBirth,
        gender: formValue.generalInfo.gender || null,
        addresses: formValue.addresses,
        employmentHistory: formValue.employmentHistory.map((emp: any) => ({
          ...emp,
          dateOfEnd: emp.isStillEmployed ? null : emp.dateOfEnd
        }))
      };

      try {
        await this.userProfileService.setUserProfile(userProfile);
        console.log('User profile saved successfully!');
        
        // Optionally navigate to a success page or show a success message
        this.router.navigate(['/user-profile'], { 
          queryParams: { updated: 'true' } 
        });
      } catch (error) {
        console.error('Failed to save user profile:', error);
        // Handle error (show error message to user)
      }
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.userProfileForm);
    }
  }

  private async getSelectedCountriesInfo(addresses: any[]): Promise<any[]> {
    try {
      const countries = await this.lookupService.loadCountries();
      return addresses.map(address => {
        const country = countries.find(c => c.isoCode === address.country);
        return {
          isoCode: address.country,
          displayName: country?.displayName || 'Unknown'
        };
      });
    } catch (error) {
      console.error('Error loading countries for display:', error);
      return addresses.map(address => ({
        isoCode: address.country,
        displayName: 'Unknown'
      }));
    }
  }

  shouldShowError(formGroupName: string, fieldName: string, errorType: string): boolean {
    const formGroup = this.userProfileForm.get(formGroupName) as FormGroup;
    const field = formGroup?.get(fieldName);
    return this.isSubmitted && field?.hasError(errorType) || false;
  }

  shouldShowAddressError(index: number, fieldName: string, errorType: string): boolean {
    const addressGroup = this.addressesFormArray.at(index) as FormGroup;
    const field = addressGroup?.get(fieldName);
    return this.isSubmitted && field?.hasError(errorType) || false;
  }

  shouldShowEmploymentError(index: number, fieldName: string, errorType: string): boolean {
    const employmentGroup = this.employmentHistoryFormArray.at(index) as FormGroup;
    const field = employmentGroup?.get(fieldName);
    return this.isSubmitted && field?.hasError(errorType) || false;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          }
        });
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  onGoHome(): void {
    const hasChanges = this.userProfileForm.dirty;
    
    if (hasChanges) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmLeave) {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }
}
