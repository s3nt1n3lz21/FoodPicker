import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  error(error: HttpErrorResponse) {
    
  }

  constructor() { }
}
