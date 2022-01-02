import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { emptyLoginDetails, ILoginForm, LoginDetails } from 'src/app/model/ILogin';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // host: {
  //   class: 'full-size'
  // }
})
export class LoginComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;

  // Component State
  public loginForm: ILoginForm = this.fb.group(emptyLoginDetails());

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const userLoginDetails: LoginDetails = this.loginForm.value;
    
    if (this.isLoginMode) {
      this.isLoading = true;
      this.authService.login(userLoginDetails.email, userLoginDetails.password).subscribe(
        (response) => {
          console.log(response)
          this.loginForm.reset();
          this.isLoading = false;
          this.router.navigate(['/food-list']);
        },
        (error) => {
          this.isLoading = false;
        }
      )

    } else {
      this.isLoading = true;
      this.authService.signUp(userLoginDetails.email, userLoginDetails.password).subscribe(
        (data) => {
          console.log(data)
          this.loginForm.reset();
          this.isLoading = false;
          this.router.navigate(['/food-list']);
        },
        (error) => {
          this.isLoading = false;
        }
      )
    }


  }
}
