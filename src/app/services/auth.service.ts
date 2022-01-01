import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

interface SignUpResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface SignInResponse extends SignUpResponse {
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
    ) { }

  signUp = (email: string, password: string): Observable<SignUpResponse> => {
    return this.http.post<SignUpResponse>(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + "AIzaSyDVqBqQITM-4fpJSPPGHNWIl-O62IbyYg0",
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError((errorResponse) => {
        let message = 'An Error Occured Signing In';
        switch (errorResponse.error.error.message) {
          case 'EMAIL_EXISTS':
            message = "An account with this email already exists";
          case 'OPERATION_NOT_ALLOWED':
            message = "Username and password sign in is disabled";
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            message = "We have temporarily blocked all requests from this device due to unusual activity. Try again later.";
        }
        this.notificationService.error(errorResponse, "Failed To Sign Up", message);
        return throwError(errorResponse);
      }
    ))

  }

  login = (email: string, password: string): Observable<SignInResponse> => {
    return this.http.post<SignInResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + "AIzaSyDVqBqQITM-4fpJSPPGHNWIl-O62IbyYg0",
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(catchError((errorResponse) => {
        let message = 'An Error Occured Signing In';
        switch (errorResponse.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            message = "No user with this email could be found";
          case 'INVALID_PASSWORD':
            message = "Password Invalid";
          case 'USER_DISABLED':
            message = "This account has been disabled";
        }
        this.notificationService.error(errorResponse, "Failed To Login", message);
        return throwError(errorResponse);
      }
    ))
  }

}
