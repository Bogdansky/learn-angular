import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { TogglePassword } from '../../shared/directives';
import {passwordMatchValidator} from '../../shared/validators'

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, MatLabel, MatButton, MatFormFieldModule, MatInputModule, TogglePassword],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration implements OnInit {
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', [Validators.required, passwordMatchValidator]]
    })
  }

  form: FormGroup;
  returnUrl: string | null = null;

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    try {
      const registerRequest = {
        login: this.form.value.login,
        password: this.form.value.password
      };
      
      await this.authService.register(registerRequest);
      this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/home');
    } catch (error) {
      console.error('Registration failed:', error);
      // You can add error handling here (show error message, etc.)
    }
  }

  togglePasswords(toggles: TogglePassword[]) {
    toggles.forEach(t => t.togglePassword());
  }

  get loginControl() {
    return this.form.get('login');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get repeatPasswordControl() {
    return this.form.get('repeatPassword');
  }
}
