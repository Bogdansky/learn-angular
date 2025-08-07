import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { UserProfile as UserProfileInterface, Gender } from '../../shared/models';
import { LookupService } from '../../shared/services/lookup.service';
import { UserProfileService } from '../../shared/services/user-profile.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
  userProfile: UserProfileInterface | null = null;
  countryNames: { [isoCode: string]: string } = {};

  constructor(
    private router: Router,
    private lookupService: LookupService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadCountryNames();
  }

  private loadUserProfile(): void {
    // For demo purposes, we'll create a sample profile
    // In a real application, this would come from a service or route parameters
    this.userProfileService.userProfile.subscribe(up => this.userProfile = up);
  }

  private async loadCountryNames(): Promise<void> {
    try {
      const countries = await this.lookupService.loadCountries();
      this.countryNames = countries.reduce((acc, country) => {
        acc[country.isoCode] = country.displayName;
        return acc;
      }, {} as { [isoCode: string]: string });
    } catch (error) {
      console.error('Error loading country names:', error);
    }
  }

  getFullName(): string {
    if (!this.userProfile) return '';
    
    const parts = [
      this.userProfile.name,
      this.userProfile.middleName,
      this.userProfile.surname
    ].filter(part => part);
    
    return parts.join(' ');
  }

  getAge(): number | null {
    if (!this.userProfile?.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.userProfile.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getFormattedDate(date: Date | null | undefined): string {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCountryName(isoCode: string): string {
    return this.countryNames[isoCode] || isoCode;
  }

  getFormattedGender(): string {
    if (!this.userProfile?.gender) return 'Not specified';
    return this.userProfile.gender.charAt(0).toUpperCase() + this.userProfile.gender.slice(1);
  }

  getEmploymentDuration(employment: any): string {
    const startDate = new Date(employment.dateOfStart);
    const endDate = employment.dateOfEnd ? new Date(employment.dateOfEnd) : new Date();
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = `${years} year${years !== 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      result += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
  }

  onEditProfile(): void {
    this.router.navigate(['/user-profile-form']);
  }

  onGoHome(): void {
    this.router.navigate(['/home']);
  }
}
