import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    public router: Router,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
      }
    )
  }

  ngOnDestroy(): void {
    
  }

}
