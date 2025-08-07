import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatLabel, MatButton, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
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
      const loginRequest = {
        login: this.form.value.login,
        password: this.form.value.password
      };
      
      await this.authService.auth(loginRequest);
      this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/home');
    } catch (error) {
      console.error('Authentication failed:', error);
      // You can add error handling here (show error message, etc.)
    }
  }
}
