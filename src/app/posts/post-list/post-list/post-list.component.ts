import { Component ,Input, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
    
})
export class PostListComponent implements OnInit ,OnDestroy {
   Posts:Post[]=[];
   isLoading=false;
   totalPosts:number=0;
   postsPerPage=1;
   pageSizeOption=[1,2,5,10];
   currentPage=1;
   userIsAuthenticated=false;
   userId:string;
   postSubscription:Subscription;
  private authStatusSub:Subscription;
  constructor(private postService:PostService,private authService:AuthService){}
ngOnInit(): void { 
  this.isLoading=true;
 this.postService.getPosts(this.postsPerPage,this.currentPage);
 this.userId=this.authService.getUserId();
 this.postSubscription=this.postService.getUpdatePostListener().subscribe(
  (postData:{posts:Post[],postCount:number})=>{
    this.isLoading=false;
    this.totalPosts=postData.postCount;
    this.Posts=postData.posts;
  });
this.userIsAuthenticated=this.authService.getIsAuth();
  this.authStatusSub=  this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
    this.userIsAuthenticated=isAuthenticated;
    this.userId=this.authService.getUserId();
     })
}
onDelete(postId:string){
  this.isLoading=true;
  this.postService.deletePost(postId).subscribe(()=>{
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  },()=>{
    this.isLoading=false;
  })
}
onChangedPage(pageData:PageEvent){
console.log(pageData);
this.currentPage=pageData.pageIndex+1;
this.postsPerPage=pageData.pageSize;
this.postService.getPosts(this.postsPerPage,this.currentPage);
}
 ngOnDestroy(): void {
  this.postSubscription.unsubscribe();
  this.authStatusSub.unsubscribe();
}
}
