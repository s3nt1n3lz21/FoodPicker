import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (user) {
          const newRequest = req.clone(
            {
              params: new HttpParams().set('auth', user.token)
            }
          )
          return next.handle(newRequest); 
        } else {
          return next.handle(req);
        }
      })
    )
  }
}
