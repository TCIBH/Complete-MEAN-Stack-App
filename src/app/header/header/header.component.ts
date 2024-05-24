import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy {
     isUserAuthenticated=false;
  private authListenerStatus:Subscription
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.isUserAuthenticated=this.authService.getIsAuth();
    this.authListenerStatus=  this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
     this.isUserAuthenticated=isAuthenticated;
      })
  }
   
  onLogout(){
    this.authService.logout();
  }


  ngOnDestroy(): void {
      this.authListenerStatus.unsubscribe();
  }
     
}
