import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  isLoginMode = true;

  // Component State
  public loginForm: ILoginForm = this.fb.group(emptyLoginDetails());

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
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

    } else {

      this.authService.signUp(userLoginDetails.email, userLoginDetails.password).subscribe(
        (response) => {
          console.log(response)
          this.loginForm.reset();
        },
        (error) => {
          console.error(error);
        }
      )
    }


  }
}
