import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp = (email: string, password: string): Observable<AuthResponseData> => {
    return this.http.post<AuthResponseData>(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + "AIzaSyDVqBqQITM-4fpJSPPGHNWIl-O62IbyYg0",
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
  }

  login = () => {}
}
