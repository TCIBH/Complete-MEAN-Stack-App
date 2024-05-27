import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy{
    isLoading:boolean=false;
    constructor(private authService:AuthService){}
    private authStatusSub:Subscription;
    ngOnInit(): void {
      this.authStatusSub= this.authService.getAuthStatusListener().subscribe((authStatus)=>{
                           this.isLoading=false;
        })
    }
    onSignup(form:NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading=true;
     this.authService.createUser(form.value.email,form.value.password)
     form.resetForm();
    }
    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}