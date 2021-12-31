import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { emptyLoginDetails, ILoginForm, LoginDetails } from 'src/app/model/ILogin';
import { NotificationService } from 'src/app/services/notification.service';
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
    private notificationService: NotificationService
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
      // this.isLoading = true;
      // this.authService.login(userLoginDetails.email, userLoginDetails.password).subscribe(
      //   (response) => {
      //     console.log(response)
      //     this.loginForm.reset();
      //     this.isLoading = false;
      //   },
      //   (error) => {
      //     console.error(error);
      //     this.isLoading = false;
      //   }
      // )


    } else {
      this.isLoading = true;
      this.authService.signUp(userLoginDetails.email, userLoginDetails.password).subscribe(
        (response) => {
          console.log(response)
          this.loginForm.reset();
          this.isLoading = false;
        },
        (error) => {
          if (error.error.code === 400) {
            this.notificationService.error(error, "Failed To Sign Up", "Email Already Exists");
          } else {
            this.notificationService.error(error);
          }
          this.isLoading = false;
        }
      )
    }


  }
}
