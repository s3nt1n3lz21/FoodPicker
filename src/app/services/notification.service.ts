import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsoleService } from './console.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private consoleService: ConsoleService) { }

  error = (error: HttpErrorResponse, title?: string, message?: string) => {
    if (!title && !message) {
      console.error(error);
    } else {
      console.error(title + message);
    }
    
    this.consoleService.error(error);
  }

  success = () => {}
}
